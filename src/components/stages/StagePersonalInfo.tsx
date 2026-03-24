import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RegistrationData } from '@/types/registration';

interface StagePersonalInfoProps {
  data: RegistrationData;
  onChange: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StagePersonalInfo: React.FC<StagePersonalInfoProps> = ({ data, onChange, onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Personal Information</CardTitle>
        <CardDescription>Please provide your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={data.fullName} onChange={(e) => onChange({ fullName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" type="tel" value={data.phoneNumber} onChange={(e) => onChange({ phoneNumber: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Sex</Label>
              <Select value={data.sex} onValueChange={(v) => onChange({ sex: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" value={data.dateOfBirth} onChange={(e) => onChange({ dateOfBirth: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Marital Status</Label>
              <Select value={data.maritalStatus} onValueChange={(v) => onChange({ maritalStatus: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nin">NIN</Label>
              <Input id="nin" value={data.nin} onChange={(e) => onChange({ nin: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input id="nationality" value={data.nationality} onChange={(e) => onChange({ nationality: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stateOfOrigin">State of Origin</Label>
              <Input id="stateOfOrigin" value={data.stateOfOrigin} onChange={(e) => onChange({ stateOfOrigin: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="localGovernment">Local Government</Label>
              <Input id="localGovernment" value={data.localGovernment} onChange={(e) => onChange({ localGovernment: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="townCity">Town/City</Label>
              <Input id="townCity" value={data.townCity} onChange={(e) => onChange({ townCity: e.target.value })} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="residentialAddress">Residential Address</Label>
              <Input id="residentialAddress" value={data.residentialAddress} onChange={(e) => onChange({ residentialAddress: e.target.value })} required />
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

export default StagePersonalInfo;
