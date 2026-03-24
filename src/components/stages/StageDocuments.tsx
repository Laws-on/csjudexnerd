import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileDropzone from '@/components/FileDropzone';
import { RegistrationData } from '@/types/registration';

interface Props {
  data: RegistrationData;
  onChange: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StageDocuments: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.projectTitle.length < 10) return;
    onNext();
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Upload Documents</CardTitle>
        <CardDescription>Upload your required documents</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FileDropzone
            label="Certification Page"
            instruction="Upload your signed certification page. PDF format only."
            accept=".pdf"
            maxSizeKB={150}
            files={data.certificationPage}
            onFilesChange={(f) => onChange({ certificationPage: f as File | null })}
          />

          <FileDropzone
            label="Project Files"
            instruction="Upload project file(s) in PDF or Word document. Max 5.0 MB (up to 2 files)."
            accept=".pdf,.doc,.docx"
            maxSizeKB={5120}
            maxFiles={2}
            multiple
            files={data.projectFiles}
            onFilesChange={(f) => onChange({ projectFiles: (f as File[]) || [] })}
          />

          <div className="space-y-2">
            <Label htmlFor="projectTitle">Project Title</Label>
            <Input
              id="projectTitle"
              value={data.projectTitle}
              onChange={(e) => onChange({ projectTitle: e.target.value })}
              required
              minLength={10}
              placeholder="Enter your project title (min. 10 characters)"
            />
            {data.projectTitle.length > 0 && data.projectTitle.length < 10 && (
              <p className="text-xs text-destructive">Project title must be at least 10 characters</p>
            )}
          </div>

          <FileDropzone
            label="Passport Photograph"
            instruction="Upload a recent passport-sized photograph with white background."
            accept=".jpg,.jpeg,.png"
            maxSizeKB={150}
            files={data.passportPhoto}
            onFilesChange={(f) => onChange({ passportPhoto: f as File | null })}
          />

          <div className="space-y-2">
            <Label>NIN Document Type</Label>
            <Select value={data.ninDocumentType} onValueChange={(v) => onChange({ ninDocumentType: v })}>
              <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="nin-slip">NIN Slip</SelectItem>
                <SelectItem value="voters-card">Voter's Card</SelectItem>
                <SelectItem value="international-passport">International Passport</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <FileDropzone
            label="NIN Document"
            instruction="Upload a clear scan or photo of your identification document."
            accept=".jpg,.jpeg,.png,.pdf"
            maxSizeKB={150}
            files={data.ninDocument}
            onFilesChange={(f) => onChange({ ninDocument: f as File | null })}
          />

          <FileDropzone
            label="Authorization Letter"
            instruction="Upload your authorization letter or statement of results. Graduating students should upload their Statement of Results instead. PDF format required."
            accept=".pdf"
            maxSizeKB={150}
            files={data.authorizationLetter}
            onFilesChange={(f) => onChange({ authorizationLetter: f as File | null })}
          />

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>Back</Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StageDocuments;
