-- Add RLS policies for product-images storage bucket so farmers can upload
CREATE POLICY "Farmers can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Farmers can update own product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Farmers can delete own product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Product images are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
