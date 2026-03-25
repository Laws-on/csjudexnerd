
-- Allow admins to download any file in registration-docs bucket
CREATE POLICY "Admins can read all registration docs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'registration-docs'
    AND public.has_role(auth.uid(), 'admin')
  );
