import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StepIndicator from '@/components/StepIndicator';
import StageAuth from '@/components/stages/StageAuth';
import StagePersonalInfo from '@/components/stages/StagePersonalInfo';
import StageNextOfKin from '@/components/stages/StageNextOfKin';
import StageAcademicData from '@/components/stages/StageAcademicData';
import StageHodSupervisor from '@/components/stages/StageHodSupervisor';
import StageDocuments from '@/components/stages/StageDocuments';
import StagePayment from '@/components/stages/StagePayment';
import { RegistrationData, initialRegistrationData } from '@/types/registration';
import { useToast } from '@/hooks/use-toast';
import { submitRegistration } from '@/lib/registration-service';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Registration: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  

  // Redirect logged-in users who already have a registration to dashboard
  React.useEffect(() => {
    if (!loading && user) {
      // Check if they already submitted a registration
      supabase
        .from('registrations')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            navigate('/dashboard');
          } else {
            setStep(2); // logged in but no registration yet, skip auth step
          }
        });
    }
  }, [loading, user, navigate]);
  const [data, setData] = useState<RegistrationData>(initialRegistrationData);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleChange = (updates: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to submit.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await submitRegistration(user.id, data);
      setCompleted(true);
      toast({ title: 'Registration Complete!', description: 'Your enrollment has been submitted successfully.' });
    } catch (err: any) {
      toast({ title: 'Submission Failed', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 animate-fade-in">
          <CheckCircle2 className="h-16 w-16 text-accent mx-auto" />
          <h1 className="font-display text-3xl font-bold text-foreground">Registration Complete!</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your enrollment has been submitted successfully. You will receive a confirmation email shortly.
          </p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-4xl flex items-center gap-3 py-4">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="font-display text-xl font-bold text-foreground">Nerd Assistance</h1>
        </div>
      </header>

      <div className="container max-w-2xl py-6">
        <StepIndicator currentStep={step} />

        <div className="mt-6">
          {step === 1 && <StageAuth onNext={() => setStep(2)} />}
          {step === 2 && <StagePersonalInfo data={data} onChange={handleChange} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StageNextOfKin data={data} onChange={handleChange} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <StageAcademicData data={data} onChange={handleChange} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
          {step === 5 && <StageHodSupervisor data={data} onChange={handleChange} onNext={() => setStep(6)} onBack={() => setStep(4)} />}
          {step === 6 && <StageDocuments data={data} onChange={handleChange} onNext={() => setStep(7)} onBack={() => setStep(5)} />}
          {step === 7 && <StagePayment data={data} onChange={handleChange} onSubmit={handleSubmit} onBack={() => setStep(6)} submitting={submitting} />}
        </div>
      </div>
    </div>
  );
};

export default Registration;
