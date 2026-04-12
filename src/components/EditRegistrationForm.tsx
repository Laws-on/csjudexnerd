import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import FileDropzone from '@/components/FileDropzone';
import { RegistrationData, initialRegistrationData } from '@/types/registration';
import { updateRegistration } from '@/lib/registration-service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface EditRegistrationFormProps {
  registration: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditRegistrationForm: React.FC<EditRegistrationFormProps> = ({ registration, onCancel, onSuccess }) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill form data from existing registration
  const [data, setData] = useState<RegistrationData>({
    ...initialRegistrationData,
    fullName: registration.full_name || '',
    phoneNumber: registration.phone_number || '',
    sex: registration.sex || '',
    dateOfBirth: registration.date_of_birth || '',
    maritalStatus: registration.marital_status || '',
    nin: registration.nin || '',
    nationality: registration.nationality || '',
    stateOfOrigin: registration.state_of_origin || '',
    localGovernment: registration.local_government || '',
    townCity: registration.town_city || '',
    residentialAddress: registration.residential_address || '',
    nokName: registration.nok_name || '',
    nokPhone: registration.nok_phone || '',
    nokEmail: registration.nok_email || '',
    institution: registration.institution || '',
    faculty: registration.faculty || '',
    department: registration.department || '',
    programmeCategory: registration.programme_category || '',
    programmeType: registration.programme_type || '',
    matriculationNumber: registration.matriculation_number || '',
    hodTitle: registration.hod_title || '',
    hodFullName: registration.hod_full_name || '',
    hodPhone: registration.hod_phone || '',
    hodEmail: registration.hod_email || '',
    supervisorTitle: registration.supervisor_title || '',
    supervisorFullName: registration.supervisor_full_name || '',
    supervisorPhone: registration.supervisor_phone || '',
    supervisorEmail: registration.supervisor_email || '',
    projectTitle: registration.project_title || '',
    ninDocumentType: registration.nin_document_type || '',
  });

  const handleChange = (updates: Partial<RegistrationData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await updateRegistration(user.id, registration.id, data, user.email);
      toast.success('Registration updated and resubmitted for review!');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h2 className="text-xl font-bold text-foreground">Edit & Resubmit Registration</h2>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Full Name</Label><Input value={data.fullName} onChange={e => handleChange({ fullName: e.target.value })} /></div>
          <div><Label>Phone Number</Label><Input value={data.phoneNumber} onChange={e => handleChange({ phoneNumber: e.target.value })} /></div>
          <div>
            <Label>Sex</Label>
            <Select value={data.sex} onValueChange={v => handleChange({ sex: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Date of Birth</Label><Input type="date" value={data.dateOfBirth} onChange={e => handleChange({ dateOfBirth: e.target.value })} /></div>
          <div>
            <Label>Marital Status</Label>
            <Select value={data.maritalStatus} onValueChange={v => handleChange({ maritalStatus: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>NIN</Label><Input value={data.nin} onChange={e => handleChange({ nin: e.target.value })} /></div>
          <div><Label>Nationality</Label><Input value={data.nationality} onChange={e => handleChange({ nationality: e.target.value })} /></div>
          <div><Label>State of Origin</Label><Input value={data.stateOfOrigin} onChange={e => handleChange({ stateOfOrigin: e.target.value })} /></div>
          <div><Label>Local Government</Label><Input value={data.localGovernment} onChange={e => handleChange({ localGovernment: e.target.value })} /></div>
          <div><Label>Town/City</Label><Input value={data.townCity} onChange={e => handleChange({ townCity: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Residential Address</Label><Input value={data.residentialAddress} onChange={e => handleChange({ residentialAddress: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Next of Kin */}
      <Card>
        <CardHeader><CardTitle>Next of Kin</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Name</Label><Input value={data.nokName} onChange={e => handleChange({ nokName: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={data.nokPhone} onChange={e => handleChange({ nokPhone: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={data.nokEmail} onChange={e => handleChange({ nokEmail: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Academic Data */}
      <Card>
        <CardHeader><CardTitle>Academic Data</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Institution</Label><Input value={data.institution} onChange={e => handleChange({ institution: e.target.value })} /></div>
          <div><Label>Faculty</Label><Input value={data.faculty} onChange={e => handleChange({ faculty: e.target.value })} /></div>
          <div><Label>Department</Label><Input value={data.department} onChange={e => handleChange({ department: e.target.value })} /></div>
          <div>
            <Label>Programme Category</Label>
            <Select value={data.programmeCategory} onValueChange={v => handleChange({ programmeCategory: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                <SelectItem value="Postgraduate">Postgraduate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Programme Type</Label><Input value={data.programmeType} onChange={e => handleChange({ programmeType: e.target.value })} /></div>
          <div><Label>Matriculation Number</Label><Input value={data.matriculationNumber} onChange={e => handleChange({ matriculationNumber: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* HOD & Supervisor */}
      <Card>
        <CardHeader><CardTitle>HOD & Supervisor</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>HOD Title</Label><Input value={data.hodTitle} onChange={e => handleChange({ hodTitle: e.target.value })} /></div>
          <div><Label>HOD Full Name</Label><Input value={data.hodFullName} onChange={e => handleChange({ hodFullName: e.target.value })} /></div>
          <div><Label>HOD Phone</Label><Input value={data.hodPhone} onChange={e => handleChange({ hodPhone: e.target.value })} /></div>
          <div><Label>HOD Email</Label><Input value={data.hodEmail} onChange={e => handleChange({ hodEmail: e.target.value })} /></div>
          <div><Label>Supervisor Title</Label><Input value={data.supervisorTitle} onChange={e => handleChange({ supervisorTitle: e.target.value })} /></div>
          <div><Label>Supervisor Full Name</Label><Input value={data.supervisorFullName} onChange={e => handleChange({ supervisorFullName: e.target.value })} /></div>
          <div><Label>Supervisor Phone</Label><Input value={data.supervisorPhone} onChange={e => handleChange({ supervisorPhone: e.target.value })} /></div>
          <div><Label>Supervisor Email</Label><Input value={data.supervisorEmail} onChange={e => handleChange({ supervisorEmail: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Project */}
      <Card>
        <CardHeader><CardTitle>Project Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Project Title</Label><Input value={data.projectTitle} onChange={e => handleChange({ projectTitle: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Documents - Re-upload */}
      <Card>
        <CardHeader>
          <CardTitle>Re-upload Documents</CardTitle>
          <CardDescription>Only upload files you want to replace. Previously uploaded files will be kept if you don't upload new ones.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Passport Photo</Label>
            <FileDropzone accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }} maxFiles={1}
              onDrop={files => handleChange({ passportPhoto: files[0] || null })}
              label={data.passportPhoto ? data.passportPhoto.name : 'Drop new passport photo (optional)'} />
          </div>
          <div>
            <Label>NIN Document</Label>
            <FileDropzone accept={{ 'image/*': ['.jpg', '.jpeg', '.png'], 'application/pdf': ['.pdf'] }} maxFiles={1}
              onDrop={files => handleChange({ ninDocument: files[0] || null })}
              label={data.ninDocument ? data.ninDocument.name : 'Drop new NIN document (optional)'} />
          </div>
          <div>
            <Label>Certification Page</Label>
            <FileDropzone accept={{ 'image/*': ['.jpg', '.jpeg', '.png'], 'application/pdf': ['.pdf'] }} maxFiles={1}
              onDrop={files => handleChange({ certificationPage: files[0] || null })}
              label={data.certificationPage ? data.certificationPage.name : 'Drop new certification page (optional)'} />
          </div>
          <div>
            <Label>Authorization Letter</Label>
            <FileDropzone accept={{ 'image/*': ['.jpg', '.jpeg', '.png'], 'application/pdf': ['.pdf'] }} maxFiles={1}
              onDrop={files => handleChange({ authorizationLetter: files[0] || null })}
              label={data.authorizationLetter ? data.authorizationLetter.name : 'Drop new authorization letter (optional)'} />
          </div>
          <div>
            <Label>Payment Receipt</Label>
            <FileDropzone accept={{ 'image/*': ['.jpg', '.jpeg', '.png'], 'application/pdf': ['.pdf'] }} maxFiles={1}
              onDrop={files => handleChange({ paymentReceipt: files[0] || null })}
              label={data.paymentReceipt ? data.paymentReceipt.name : 'Drop new payment receipt (optional)'} />
          </div>
          <div>
            <Label>Project Files</Label>
            <FileDropzone accept={{ 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'] }} maxFiles={5}
              onDrop={files => handleChange({ projectFiles: files })}
              label={data.projectFiles.length > 0 ? `${data.projectFiles.length} file(s) selected` : 'Drop new project files (optional)'} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</> : <><Save className="h-4 w-4 mr-2" /> Resubmit Registration</>}
        </Button>
      </div>
    </div>
  );
};

export default EditRegistrationForm;
