-- Forward-only patch: applies approval flow to already-deployed projects
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'pending'
CHECK (approval_status IN ('pending', 'approved', 'rejected'));

UPDATE public.products
SET approval_status = 'approved'
WHERE is_active = true
  AND approval_status = 'pending';

DROP POLICY IF EXISTS "Admins can review products" ON public.products;
CREATE POLICY "Admins can review products"
ON public.products FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to approve farmer profiles
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles"
ON public.profiles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
