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

const titles = ['Prof.', 'Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Engr.', 'Barr.', 'Arc.'];

const StageHodSupervisor: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onNext(); };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="font-display text-2xl">HOD & Supervisor Information</CardTitle>
        <CardDescription>Provide your Head of Department and Supervisor details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* HOD Section */}
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">Head of Department</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Select value={data.hodTitle} onValueChange={(v) => onChange({ hodTitle: v })}>
                  <SelectTrigger><SelectValue placeholder="Select title" /></SelectTrigger>
                  <SelectContent>
                    {titles.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hodFullName">Full Name</Label>
                <Input id="hodFullName" value={data.hodFullName} onChange={(e) => onChange({ hodFullName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hodPhone">Phone Number</Label>
                <Input id="hodPhone" type="tel" value={data.hodPhone} onChange={(e) => onChange({ hodPhone: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hodEmail">Email</Label>
                <Input id="hodEmail" type="email" value={data.hodEmail} onChange={(e) => onChange({ hodEmail: e.target.value })} required />
              </div>
            </div>
          </div>

          {/* Supervisor Section */}
          <div className="border-t border-border pt-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">Supervisor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Select value={data.supervisorTitle} onValueChange={(v) => onChange({ supervisorTitle: v })}>
                  <SelectTrigger><SelectValue placeholder="Select title" /></SelectTrigger>
                  <SelectContent>
                    {titles.map((t) => <SelectItem key={`s-${t}`} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisorFullName">Full Name</Label>
                <Input id="supervisorFullName" value={data.supervisorFullName} onChange={(e) => onChange({ supervisorFullName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisorPhone">Phone Number</Label>
                <Input id="supervisorPhone" type="tel" value={data.supervisorPhone} onChange={(e) => onChange({ supervisorPhone: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisorEmail">Email</Label>
                <Input id="supervisorEmail" type="email" value={data.supervisorEmail} onChange={(e) => onChange({ supervisorEmail: e.target.value })} required />
              </div>
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

export default StageHodSupervisor;
