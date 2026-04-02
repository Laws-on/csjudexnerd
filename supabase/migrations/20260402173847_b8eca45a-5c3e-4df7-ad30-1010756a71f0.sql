
-- Fix 1: Prevent users from self-modifying payment_status
-- Drop the existing permissive user update policy
DROP POLICY IF EXISTS "Users can update own registration" ON public.registrations;

-- Create a trigger function that prevents non-admin users from changing payment_status
CREATE OR REPLACE FUNCTION public.prevent_payment_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If payment_status is being changed and user is not admin, revert it
  IF NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      NEW.payment_status := OLD.payment_status;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on registrations table
DROP TRIGGER IF EXISTS prevent_payment_status_change_trigger ON public.registrations;
CREATE TRIGGER prevent_payment_status_change_trigger
  BEFORE UPDATE ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_payment_status_change();

-- Re-create user update policy (still allows updates to other columns)
CREATE POLICY "Users can update own registration"
  ON public.registrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Fix 2: Add storage RLS policies for registration-docs bucket
-- Allow users to upload to their own folder
CREATE POLICY "Users can upload own registration docs"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'registration-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to view their own uploaded files
CREATE POLICY "Users can view own registration docs"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'registration-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow admins to view all registration docs
CREATE POLICY "Admins can view all registration docs"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'registration-docs'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Allow admins to delete registration docs
CREATE POLICY "Admins can delete registration docs"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'registration-docs'
    AND public.has_role(auth.uid(), 'admin')
  );
