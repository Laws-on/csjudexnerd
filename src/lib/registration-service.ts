import { supabase } from '@/integrations/supabase/client';
import { RegistrationData } from '@/types/registration';

async function uploadFile(userId: string, folder: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${userId}/${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('registration-docs').upload(path, file);
  if (error) throw new Error(`Upload failed (${folder}): ${error.message}`);
  return path;
}

export async function submitRegistration(userId: string, data: RegistrationData) {
  // Upload files in parallel
  const uploads = await Promise.all([
    data.certificationPage ? uploadFile(userId, 'certification', data.certificationPage) : null,
    data.passportPhoto ? uploadFile(userId, 'passport', data.passportPhoto) : null,
    data.ninDocument ? uploadFile(userId, 'nin', data.ninDocument) : null,
    data.authorizationLetter ? uploadFile(userId, 'authorization', data.authorizationLetter) : null,
    data.paymentReceipt ? uploadFile(userId, 'payment', data.paymentReceipt) : null,
    ...data.projectFiles.map((f) => uploadFile(userId, 'projects', f)),
  ]);

  const [certPath, passportPath, ninPath, authPath, receiptPath, ...projectPaths] = uploads;

  const { error } = await supabase.from('registrations').insert({
    user_id: userId,
    student_email: data.email,
    full_name: data.fullName,
    phone_number: data.phoneNumber,
    sex: data.sex,
    date_of_birth: data.dateOfBirth,
    marital_status: data.maritalStatus,
    nin: data.nin,
    nationality: data.nationality,
    state_of_origin: data.stateOfOrigin,
    local_government: data.localGovernment,
    town_city: data.townCity,
    residential_address: data.residentialAddress,
    nok_name: data.nokName,
    nok_phone: data.nokPhone,
    nok_email: data.nokEmail,
    institution: data.institution,
    faculty: data.faculty,
    department: data.department,
    programme_category: data.programmeCategory,
    programme_type: data.programmeType,
    matriculation_number: data.matriculationNumber,
    hod_title: data.hodTitle,
    hod_full_name: data.hodFullName,
    hod_phone: data.hodPhone,
    hod_email: data.hodEmail,
    supervisor_title: data.supervisorTitle,
    supervisor_full_name: data.supervisorFullName,
    supervisor_phone: data.supervisorPhone,
    supervisor_email: data.supervisorEmail,
    certification_page_path: certPath,
    project_file_paths: projectPaths.filter(Boolean) as string[],
    project_title: data.projectTitle,
    passport_photo_path: passportPath,
    nin_document_type: data.ninDocumentType,
    nin_document_path: ninPath,
    authorization_letter_path: authPath,
    payment_receipt_path: receiptPath,
    payment_status: 'pending',
  } as any);

  if (error) throw new Error(`Registration failed: ${error.message}`);
}
