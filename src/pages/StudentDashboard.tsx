import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, FileText, Clock, CheckCircle2, AlertCircle, LogOut, Download } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [approvalSlipUrl, setApprovalSlipUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/register');
      return;
    }
    if (user) {
      supabase
        .from('registrations')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(async ({ data }) => {
          setRegistration(data);
          // Check for approval slip in storage
          const { data: files } = await supabase.storage
            .from('registration-docs')
            .list(`${user.id}/approval-slip`);
          if (files && files.length > 0) {
            const latestFile = files.sort((a, b) => b.name.localeCompare(a.name))[0];
            const { data: urlData } = supabase.storage
              .from('registration-docs')
              .getPublicUrl(`${user.id}/approval-slip/${latestFile.name}`);
            // Since bucket is private, use createSignedUrl instead
            const { data: signedData } = await supabase.storage
              .from('registration-docs')
              .createSignedUrl(`${user.id}/approval-slip/${latestFile.name}`, 3600);
            if (signedData?.signedUrl) {
              setApprovalSlipUrl(signedData.signedUrl);
            }
          }
          setFetching(false);
        });
    }
  }, [user, loading, navigate]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-5 w-5" /> },
    confirmed: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-5 w-5" /> },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-5 w-5" /> },
  };

  const status = registration ? statusConfig[registration.payment_status] || statusConfig.pending : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container max-w-4xl flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="font-display text-xl font-bold text-foreground">Student Dashboard</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/'); }}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="container max-w-2xl py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome{registration ? `, ${registration.full_name}` : ''}!</h2>
          <p className="text-muted-foreground mt-1">
            {user?.email}
          </p>
        </div>

        {registration ? (
          <>
            {/* Registration Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Registration Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  {status?.icon}
                  <Badge className={status?.color}>{status?.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Institution</p>
                    <p className="font-medium text-foreground">{registration.institution}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Department</p>
                    <p className="font-medium text-foreground">{registration.department}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Matric Number</p>
                    <p className="font-medium text-foreground">{registration.matriculation_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Programme</p>
                    <p className="font-medium text-foreground">{registration.programme_type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium text-foreground">{new Date(registration.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment</p>
                    <p className="font-medium text-foreground capitalize">{registration.payment_status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents summary */}
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
                <CardDescription>Documents you submitted during registration</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {registration.passport_photo_path && (
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" /> Passport Photo</li>
                  )}
                  {registration.nin_document_path && (
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" /> NIN Document</li>
                  )}
                  {registration.certification_page_path && (
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" /> Certification Page</li>
                  )}
                  {registration.authorization_letter_path && (
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" /> Authorization Letter</li>
                  )}
                  {registration.payment_receipt_path && (
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" /> Payment Receipt</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </>
        ) : (
          /* No registration yet */
          <Card>
            <CardHeader>
              <CardTitle>Start Your Registration</CardTitle>
              <CardDescription>You haven't submitted a registration yet. Begin the process now.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/register')}>
                Begin Registration
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
