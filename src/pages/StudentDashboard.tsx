import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, FileText, Clock, CheckCircle2, AlertCircle, LogOut, Download, ExternalLink, Edit, Plus } from 'lucide-react';
import EditRegistrationForm from '@/components/EditRegistrationForm';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

const isImageFile = (path: string) => {
  const lower = path.toLowerCase();
  return IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext));
};

const DocumentThumbnail: React.FC<{ path: string; label: string; onClick: () => void }> = ({ path, label, onClick }) => {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isImageFile(path)) {
      supabase.storage
        .from('registration-docs')
        .createSignedUrl(path, 3600)
        .then(({ data }) => {
          if (data?.signedUrl) setThumbUrl(data.signedUrl);
        });
    }
  }, [path]);

  return (
    <li>
      <button onClick={onClick} className="flex items-center gap-3 text-primary hover:underline cursor-pointer w-full text-left">
        {thumbUrl ? (
          <img src={thumbUrl} alt={label} className="h-12 w-12 rounded border border-border object-cover flex-shrink-0" />
        ) : (
          <div className="h-12 w-12 rounded border border-border bg-muted flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <span className="flex items-center gap-1">
          <ExternalLink className="h-3.5 w-3.5" /> {label}
        </span>
      </button>
    </li>
  );
};

const StudentDashboard: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [approvalSlipUrl, setApprovalSlipUrl] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const openDocument = useCallback(async (path: string) => {
    const { data } = await supabase.storage
      .from('registration-docs')
      .createSignedUrl(path, 3600);
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    }
  }, []);

  const fetchRegistration = useCallback(async () => {
    if (!user) return;
    setFetching(true);
    const { data } = await supabase
      .from('registrations')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    setRegistration(data);
    if (data?.payment_status === 'confirmed') {
      const { data: files } = await supabase.storage
        .from('registration-docs')
        .list(`${user.id}/approval-slip`);
      if (files && files.length > 0) {
        const latestFile = files.sort((a, b) => b.name.localeCompare(a.name))[0];
        const { data: signedData } = await supabase.storage
          .from('registration-docs')
          .createSignedUrl(`${user.id}/approval-slip/${latestFile.name}`, 3600);
        if (signedData?.signedUrl) {
          setApprovalSlipUrl(signedData.signedUrl);
        }
      }
    }
    setFetching(false);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/register');
      return;
    }
    if (user) fetchRegistration();
  }, [user, loading, navigate, fetchRegistration]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Editing mode
  if (editing && registration) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container max-w-4xl flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="font-display text-xl font-bold text-foreground">Edit Registration</h1>
            </div>
          </div>
        </header>
        <div className="container max-w-2xl py-8">
          <EditRegistrationForm
            registration={registration}
            onCancel={() => setEditing(false)}
            onSuccess={() => {
              setEditing(false);
              fetchRegistration();
            }}
          />
        </div>
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
          <p className="text-muted-foreground mt-1">{user?.email}</p>
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

                {registration.payment_status === 'rejected' && registration.rejection_reason && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                    <p className="text-sm font-medium text-destructive mb-1">Rejection Reason:</p>
                    <p className="text-sm text-foreground">{registration.rejection_reason}</p>
                  </div>
                )}

                {/* Edit & Resubmit button for rejected registrations */}
                {registration.payment_status === 'rejected' && (
                  <Button onClick={() => setEditing(true)} className="mt-2">
                    <Edit className="h-4 w-4 mr-2" /> Edit & Resubmit
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Documents summary */}
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
                <CardDescription>Documents you submitted during registration</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {registration.passport_photo_path && (
                    <DocumentThumbnail path={registration.passport_photo_path} label="Passport Photo" onClick={() => openDocument(registration.passport_photo_path)} />
                  )}
                  {registration.nin_document_path && (
                    <DocumentThumbnail path={registration.nin_document_path} label="NIN Document" onClick={() => openDocument(registration.nin_document_path)} />
                  )}
                  {registration.certification_page_path && (
                    <DocumentThumbnail path={registration.certification_page_path} label="Certification Page" onClick={() => openDocument(registration.certification_page_path)} />
                  )}
                  {registration.authorization_letter_path && (
                    <DocumentThumbnail path={registration.authorization_letter_path} label="Authorization Letter" onClick={() => openDocument(registration.authorization_letter_path)} />
                  )}
                  {registration.payment_receipt_path && (
                    <DocumentThumbnail path={registration.payment_receipt_path} label="Payment Receipt" onClick={() => openDocument(registration.payment_receipt_path)} />
                  )}
                  {registration.project_file_paths && registration.project_file_paths.length > 0 && (
                    registration.project_file_paths.map((path: string, i: number) => (
                      <DocumentThumbnail key={path} path={path} label={`Project File ${i + 1}`} onClick={() => openDocument(path)} />
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Approval Slip Download */}
            {registration.payment_status === 'confirmed' && approvalSlipUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Approval Slip
                  </CardTitle>
                  <CardDescription>Your NERD clearance slip is ready for download</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <a href={approvalSlipUrl} target="_blank" rel="noopener noreferrer" download>
                      <Download className="h-4 w-4 mr-2" /> Download Approval Slip
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {registration.payment_status === 'confirmed' && !approvalSlipUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    Approval Slip
                  </CardTitle>
                  <CardDescription>Your payment has been confirmed. The approval slip will be available here once the admin uploads it.</CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* New Submission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  New Submission
                </CardTitle>
                <CardDescription>Start a fresh registration submission</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Edit & Submit New Version
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
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
