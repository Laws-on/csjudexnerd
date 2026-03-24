import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  'Account',
  'Personal Info',
  'Next of Kin',
  'Academic Data',
  'HOD & Supervisor',
  'Documents',
  'Payment',
];

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {STEPS.map((step, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all',
                    isCompleted && 'step-indicator-completed',
                    isActive && 'step-indicator-active',
                    !isActive && !isCompleted && 'step-indicator-inactive'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium hidden sm:block',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-1',
                    stepNum < currentStep ? 'bg-accent' : 'bg-border'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
