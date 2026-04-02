import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { LogOut, Users, CreditCard, Eye, Search, Download, FileText, FileCheck } from 'lucide-react';
import { generateApprovedSlip } from '@/lib/generate-approved-slip';
import { Input } from '@/components/ui/input';

interface Registration {
  id: string;
  user_id: string;
  student_email: string | null;
  full_name: string;
  phone_number: string;
  sex: string;
  date_of_birth: string;
  marital_status: string;
  nin: string;
  nationality: string;
  state_of_origin: string;
  local_government: string;
  town_city: string;
  residential_address: string;
  nok_name: string;
  nok_phone: string;
  nok_email: string;
  institution: string;
  faculty: string;
  department: string;
  programme_category: string;
  programme_type: string;
  matriculation_number: string;
  hod_title: string;
  hod_full_name: string;
  hod_phone: string;
  hod_email: string;
  supervisor_title: string;
  supervisor_full_name: string;
  supervisor_phone: string;
  supervisor_email: string;
  project_title: string;
  payment_status: string;
  created_at: string;
  certification_page_path: string | null;
  passport_photo_path: string | null;
  nin_document_path: string | null;
  nin_document_type: string | null;
  authorization_letter_path: string | null;
  payment_receipt_path: string | null;
  project_file_paths: string[] | null;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
};

async function downloadFile(path: string, filename: string) {
  const { data, error } = await supabase.storage.from('registration-docs').download(path);
  if (error || !data) {
    toast.error('Failed to download file');
    return;
  }
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function getPreviewUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from('registration-docs').download(path);
  if (error || !data) return null;
  return URL.createObjectURL(data);
}

export default function AdminDashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selected, setSelected] = useState<Registration | null>(null);
  const [search, setSearch] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLabel, setPreviewLabel] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/admin'); return; }

    (async () => {
      const { data } = await supabase
        .from('user_roles' as any)
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');

      if (!data || (data as any[]).length === 0) {
        toast.error('Access denied — you are not an admin.');
        navigate('/');
        return;
      }
      setIsAdmin(true);
      fetchRegistrations();
    })();
  }, [user, authLoading]);

  const fetchRegistrations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('registrations').select('*');
    if (error) { toast.error(error.message); }
    else { setRegistrations((data as Registration[]) || []); }
    setLoading(false);
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('registrations').update({ payment_status: status } as any).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Payment status updated to ${status}`);
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, payment_status: status } : r));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, payment_status: status } : null);
  };

  const handlePreview = async (path: string, label: string) => {
    setPreviewLabel(label);
    setPreviewLoading(true);
    setPreviewUrl('loading');
    const url = await getPreviewUrl(path);
    if (!url) {
      toast.error('Failed to load preview');
      setPreviewUrl(null);
      setPreviewLoading(false);
      return;
    }
    setPreviewUrl(url);
    setPreviewLoading(false);
  };

  const closePreview = () => {
    if (previewUrl && previewUrl !== 'loading') URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewLabel('');
  };

  const filtered = registrations.filter(r =>
    r.full_name.toLowerCase().includes(search.toLowerCase()) ||
    r.matriculation_number.toLowerCase().includes(search.toLowerCase()) ||
    r.institution.toLowerCase().includes(search.toLowerCase()) ||
    (r.student_email || '').toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.payment_status === 'pending').length,
    confirmed: registrations.filter(r => r.payment_status === 'confirmed').length,
  };

  if (authLoading || (!isAdmin && loading)) {
    return <div className="flex items-center justify-center min-h-screen bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/'); }}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="pt-6 flex items-center gap-4">
            <Users className="h-8 w-8 text-primary" />
            <div><p className="text-sm text-muted-foreground">Total Registrations</p><p className="text-2xl font-bold">{stats.total}</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-accent-foreground" />
            <div><p className="text-sm text-muted-foreground">Pending Payments</p><p className="text-2xl font-bold">{stats.pending}</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <div><p className="text-sm text-muted-foreground">Confirmed Payments</p><p className="text-2xl font-bold">{stats.confirmed}</p></div>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Student Registrations</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search name, matric, institution..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? <p className="text-muted-foreground py-8 text-center">Loading registrations...</p> : filtered.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No registrations found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Matric No.</TableHead>
                    <TableHead>Programme</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(reg => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{reg.full_name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{reg.student_email || '—'}</TableCell>
                      <TableCell>{reg.institution}</TableCell>
                      <TableCell>{reg.matriculation_number}</TableCell>
                      <TableCell>{reg.programme_type}</TableCell>
                      <TableCell>
                        <Select value={reg.payment_status} onValueChange={v => updatePaymentStatus(reg.id, v)}>
                          <SelectTrigger className={`w-32 text-xs h-8 ${statusColors[reg.payment_status] || ''}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setSelected(reg)}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader><DialogTitle>{selected?.full_name} — Registration Details</DialogTitle></DialogHeader>
          {selected && (
            <ScrollArea className="max-h-[65vh] pr-4">
              <div className="space-y-4">
                <Section title="Personal Information">
                  <Field label="Email" value={selected.student_email || 'N/A'} />
                  <Field label="Phone" value={selected.phone_number} />
                  <Field label="Sex" value={selected.sex} />
                  <Field label="Date of Birth" value={selected.date_of_birth} />
                  <Field label="Marital Status" value={selected.marital_status} />
                  <Field label="NIN" value={selected.nin} />
                  <Field label="Nationality" value={selected.nationality} />
                  <Field label="State of Origin" value={selected.state_of_origin} />
                  <Field label="LGA" value={selected.local_government} />
                  <Field label="Town/City" value={selected.town_city} />
                  <Field label="Address" value={selected.residential_address} />
                </Section>
                <Separator />
                <Section title="Next of Kin">
                  <Field label="Name" value={selected.nok_name} />
                  <Field label="Phone" value={selected.nok_phone} />
                  <Field label="Email" value={selected.nok_email} />
                </Section>
                <Separator />
                <Section title="Academic Data">
                  <Field label="Institution" value={selected.institution} />
                  <Field label="Faculty" value={selected.faculty} />
                  <Field label="Department" value={selected.department} />
                  <Field label="Programme" value={`${selected.programme_category} — ${selected.programme_type}`} />
                  <Field label="Matric No." value={selected.matriculation_number} />
                </Section>
                <Separator />
                <Section title="HOD & Supervisor">
                  <Field label="HOD" value={`${selected.hod_title} ${selected.hod_full_name}`} />
                  <Field label="HOD Phone" value={selected.hod_phone} />
                  <Field label="HOD Email" value={selected.hod_email} />
                  <Field label="Supervisor" value={`${selected.supervisor_title} ${selected.supervisor_full_name}`} />
                  <Field label="Supervisor Phone" value={selected.supervisor_phone} />
                  <Field label="Supervisor Email" value={selected.supervisor_email} />
                </Section>
                <Separator />
                <Section title="Project & Payment">
                  <Field label="Project Title" value={selected.project_title} />
                  <Field label="Payment Status" value={selected.payment_status} />
                  <Field label="Registered" value={new Date(selected.created_at).toLocaleDateString()} />
                </Section>
                {selected.payment_status === 'confirmed' && (
                  <>
                    <Separator />
                    <Button
                      className="w-full"
                      onClick={() =>
                        generateApprovedSlip({
                          fullName: selected.full_name,
                          matriculationNumber: selected.matriculation_number,
                          institution: selected.institution,
                          faculty: selected.faculty,
                          department: selected.department,
                          programmeCategory: selected.programme_category,
                          programmeType: selected.programme_type,
                          projectTitle: selected.project_title,
                          approvalDate: new Date().toLocaleDateString(),
                        })
                      }
                    >
                      <FileCheck className="h-4 w-4 mr-2" /> Generate Approved Slip (PDF)
                    </Button>
                  </>
                )}
                <Separator />
                <Section title="Uploaded Documents">
                  <div className="col-span-2 space-y-2">
                    <DocLink label="Certification Page" path={selected.certification_page_path} name={selected.full_name} onPreview={handlePreview} />
                    <DocLink label="Passport Photo" path={selected.passport_photo_path} name={selected.full_name} onPreview={handlePreview} />
                    <DocLink label={`NIN Document (${selected.nin_document_type || 'N/A'})`} path={selected.nin_document_path} name={selected.full_name} onPreview={handlePreview} />
                    <DocLink label="Authorization Letter" path={selected.authorization_letter_path} name={selected.full_name} onPreview={handlePreview} />
                    <DocLink label="Payment Receipt" path={selected.payment_receipt_path} name={selected.full_name} onPreview={handlePreview} />
                    {selected.project_file_paths && selected.project_file_paths.length > 0 && (
                      selected.project_file_paths.map((p, i) => (
                        <DocLink key={i} label={`Project File ${i + 1}`} path={p} name={selected.full_name} onPreview={handlePreview} />
                      ))
                    )}
                  </div>
                </Section>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DocLink({ label, path, name }: { label: string; path: string | null; name: string }) {
  if (!path) {
    return (
      <div className="flex items-center justify-between py-1.5 px-3 rounded-md bg-muted/50">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <span className="text-xs text-muted-foreground italic">Not uploaded</span>
      </div>
    );
  }

  const ext = path.split('.').pop() || 'file';
  const filename = `${name.replace(/\s+/g, '_')}_${label.replace(/\s+/g, '_')}.${ext}`;

  return (
    <div className="flex items-center justify-between py-1.5 px-3 rounded-md bg-muted/50">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => downloadFile(path, filename)}>
        <Download className="h-3.5 w-3.5 mr-1" /> Download
      </Button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-primary mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}
