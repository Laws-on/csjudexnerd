
-- Remove duplicate storage policies
DROP POLICY IF EXISTS "Users can upload own docs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own docs" ON storage.objects;

-- Add UPDATE policy for users on their own docs
CREATE POLICY "Users can update own registration docs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'registration-docs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Add DELETE policy for users on their own docs
CREATE POLICY "Users can delete own registration docs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'registration-docs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
