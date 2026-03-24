import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RegistrationData } from '@/types/registration';

interface Props {
  data: RegistrationData;
  onChange: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StageNextOfKin: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onNext(); };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Next of Kin</CardTitle>
        <CardDescription>Provide details of your next of kin</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nokName">Full Name</Label>
            <Input id="nokName" value={data.nokName} onChange={(e) => onChange({ nokName: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nokPhone">Phone Number</Label>
            <Input id="nokPhone" type="tel" value={data.nokPhone} onChange={(e) => onChange({ nokPhone: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nokEmail">Email Address</Label>
            <Input id="nokEmail" type="email" value={data.nokEmail} onChange={(e) => onChange({ nokEmail: e.target.value })} required />
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

export default StageNextOfKin;
