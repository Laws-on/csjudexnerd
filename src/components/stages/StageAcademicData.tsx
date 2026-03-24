import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RegistrationData } from '@/types/registration';

interface Props {
  data: RegistrationData;
  onChange: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const programmeTypes = [
  'B.Sc.', 'B.Tech', 'B.Eng.', 'MBBS', 'MBChB', 'B.A.', 'LL.B', 'B.Arch.',
  'B.Ed.', 'M.Sc.', 'M.A.', 'MBA', 'Ph.D.', 'PGD', 'HND', 'ND', 'NCE', 'Other',
];

const StageAcademicData: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onNext(); };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Academic Data</CardTitle>
        <CardDescription>Provide your academic information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="institution">Institution</Label>
              <Input id="institution" value={data.institution} onChange={(e) => onChange({ institution: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty</Label>
              <Input id="faculty" value={data.faculty} onChange={(e) => onChange({ faculty: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={data.department} onChange={(e) => onChange({ department: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Programme Category</Label>
              <Select value={data.programmeCategory} onValueChange={(v) => onChange({ programmeCategory: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Programme Type</Label>
              <Select value={data.programmeType} onValueChange={(v) => onChange({ programmeType: v })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {programmeTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="matriculationNumber">Matriculation Number</Label>
              <Input id="matriculationNumber" value={data.matriculationNumber} onChange={(e) => onChange({ matriculationNumber: e.target.value })} required />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>Back</Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StageAcademicData;
