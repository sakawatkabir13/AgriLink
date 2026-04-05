
-- Update handle_new_user to also assign role from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name, email, region, farm_name, farm_size, crops_grown)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'region',
    NEW.raw_user_meta_data->>'farm_name',
    NEW.raw_user_meta_data->>'farm_size',
    CASE 
      WHEN NEW.raw_user_meta_data->'crops_grown' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'crops_grown'))
      ELSE NULL
    END
  );

  -- Auto-assign role from metadata
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'role')::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger if not exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add approval workflow for farmer products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'pending'
CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Keep current active products visible after introducing approval flow
UPDATE public.products
SET approval_status = 'approved'
WHERE is_active = true;

-- Admins can review and update product approval status
DROP POLICY IF EXISTS "Admins can review products" ON public.products;
CREATE POLICY "Admins can review products"
ON public.products FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
