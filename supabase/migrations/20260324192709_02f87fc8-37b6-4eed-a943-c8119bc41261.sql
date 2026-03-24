
-- Create registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Personal Info
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  sex TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  marital_status TEXT NOT NULL,
  nin TEXT NOT NULL,
  nationality TEXT NOT NULL,
  state_of_origin TEXT NOT NULL,
  local_government TEXT NOT NULL,
  town_city TEXT NOT NULL,
  residential_address TEXT NOT NULL,
  
  -- Next of Kin
  nok_name TEXT NOT NULL,
  nok_phone TEXT NOT NULL,
  nok_email TEXT NOT NULL,
  
  -- Academic Data
  institution TEXT NOT NULL,
  faculty TEXT NOT NULL,
  department TEXT NOT NULL,
  programme_category TEXT NOT NULL,
  programme_type TEXT NOT NULL,
  matriculation_number TEXT NOT NULL,
  
  -- HOD Info
  hod_title TEXT NOT NULL,
  hod_full_name TEXT NOT NULL,
  hod_phone TEXT NOT NULL,
  hod_email TEXT NOT NULL,
  
  -- Supervisor Info
  supervisor_title TEXT NOT NULL,
  supervisor_full_name TEXT NOT NULL,
  supervisor_phone TEXT NOT NULL,
  supervisor_email TEXT NOT NULL,
  
  -- Document paths (storage references)
  certification_page_path TEXT,
  project_file_paths TEXT[] DEFAULT '{}',
  project_title TEXT NOT NULL,
  passport_photo_path TEXT,
  nin_document_type TEXT,
  nin_document_path TEXT,
  authorization_letter_path TEXT,
  
  -- Payment
  payment_receipt_path TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Users can insert their own registration
CREATE POLICY "Users can insert own registration"
  ON public.registrations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own registration
CREATE POLICY "Users can view own registration"
  ON public.registrations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own registration
CREATE POLICY "Users can update own registration"
  ON public.registrations FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for registration documents
INSERT INTO storage.buckets (id, name, public) VALUES ('registration-docs', 'registration-docs', false);

-- Storage policies: users can upload to their own folder
CREATE POLICY "Users can upload own docs"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'registration-docs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own docs"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'registration-docs' AND (storage.foldername(name))[1] = auth.uid()::text);
