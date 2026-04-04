
CREATE POLICY "Admins can upload to any folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'registration-docs'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
