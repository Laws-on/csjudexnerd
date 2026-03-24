import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import FileDropzone from '@/components/FileDropzone';
import { RegistrationData } from '@/types/registration';
import { Banknote, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  data: RegistrationData;
  onChange: (updates: Partial<RegistrationData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}

const StagePayment: React.FC<Props> = ({ data, onChange, onSubmit, onBack, submitting }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Account number copied to clipboard.' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Payment</CardTitle>
        <CardDescription>Complete your payment to finalize enrollment</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fee Breakdown */}
          <div className="rounded-lg bg-secondary p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Student Enrollment & Project Upload</span>
              <span className="font-medium text-foreground">₦8,500</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Charge / Work Done</span>
              <span className="font-medium text-foreground">₦4,500</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-primary text-lg">₦13,000</span>
            </div>
          </div>

          {/* Bank Transfer Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold text-foreground">Bank Transfer Details</h3>
            </div>
            <p className="text-sm text-muted-foreground">Make a transfer to one of the accounts below:</p>

            {/* Account 1 */}
            <div className="rounded-lg border border-border p-4 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Account 1</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">8072884682</p>
                  <p className="text-sm text-muted-foreground">Sunday Ugwu</p>
                  <p className="text-sm text-muted-foreground">Opay</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('8072884682')}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
              </div>
            </div>

            {/* Account 2 */}
            <div className="rounded-lg border border-border p-4 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Account 2</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">9021662757</p>
                  <p className="text-sm text-muted-foreground">Ugwu Ugochukwu</p>
                  <p className="text-sm text-muted-foreground">Opay</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('9021662757')}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
              </div>
            </div>
          </div>

          {/* Payment Receipt Upload */}
          <FileDropzone
            label="Payment Receipt"
            instruction="Upload a screenshot or PDF of your payment confirmation."
            accept=".jpg,.jpeg,.png,.pdf"
            maxSizeKB={5120}
            files={data.paymentReceipt}
            onFilesChange={(f) => onChange({ paymentReceipt: f as File | null })}
          />

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>Back</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Registration'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StagePayment;
