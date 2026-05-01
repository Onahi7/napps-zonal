import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Download, Printer, FileText, Loader2, CheckCircle2, AlertCircle 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface SchoolBackup {
  school_id: string;
  name: string;
  proprietor_name: string;
  state: string;
  lga: string;
  type: string;
  payment_status: string;
  registration_date: string;
}

export default function OfflineBackup() {
  const [schoolId, setSchoolId] = useState("");
  const [loading, setLoading] = useState(false);
  const [schoolData, setSchoolData] = useState<SchoolBackup | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!schoolId) {
      toast.error('Please enter a school ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .rpc('get_school_public_info', { school_id_text: schoolId });

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('School not found');
      }

      setSchoolData(data[0]);
      toast.success('School data loaded!');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch school data');
      setSchoolData(null);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!schoolData) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('NAPPS North Central Zone', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('School Registration Backup', 105, 30, { align: 'center' });
    
    // School Details
    doc.setFontSize(12);
    doc.text(`School ID: ${schoolData.school_id}`, 20, 50);
    doc.text(`School Name: ${schoolData.name}`, 20, 60);
    doc.text(`Proprietor: ${schoolData.proprietor_name}`, 20, 70);
    doc.text(`State: ${schoolData.state}`, 20, 80);
    doc.text(`LGA: ${schoolData.lga}`, 20, 90);
    doc.text(`Type: ${schoolData.type}`, 20, 100);
    doc.text(`Payment Status: ${schoolData.payment_status}`, 20, 110);
    doc.text(`Registration Date: ${schoolData.registration_date || 'N/A'}`, 20, 120);
    
    // Footer
    doc.setFontSize(10);
    doc.text('Powered by Pre-Campus Computers & Pre Campus College Schs Ltd', 105, 280, { align: 'center' });
    doc.text('For verification, visit: https://napps-northcentral.com/verify', 105, 285, { align: 'center' });
    
    // Save
    doc.save(`school-backup-${schoolData.school_id}.pdf`);
    toast.success('PDF downloaded!');
  };

  const generateHardCopyForm = () => {
    if (!schoolData) return;

    const printContent = `
      <html>
        <head>
          <title>School Registration Form - ${schoolData.school_id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .section-title { font-weight: bold; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; display: inline-block; width: 200px; }
            .value { display: inline-block; border-bottom: 1px solid #000; min-width: 300px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              body { padding: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>NAPPS NORTH CENTRAL ZONE</h1>
            <h2>School Registration Form (Hard Copy Backup)</h2>
            <p>MOU: NAPPS, Pre Campus College Schs Ltd & Pre Campus College Computers</p>
          </div>

          <div class="section">
            <div class="section-title">School Information</div>
            <div class="field"><span class="label">School ID:</span><span class="value">${schoolData.school_id}</span></div>
            <div class="field"><span class="label">School Name:</span><span class="value">${schoolData.name}</span></div>
            <div class="field"><span class="label">School Type:</span><span class="value">${schoolData.type || 'N/A'}</span></div>
            <div class="field"><span class="label">State:</span><span class="value">${schoolData.state}</span></div>
            <div class="field"><span class="label">LGA:</span><span class="value">${schoolData.lga}</span></div>
          </div>

          <div class="section">
            <div class="section-title">Proprietor Information</div>
            <div class="field"><span class="label">Name:</span><span class="value">${schoolData.proprietor_name || 'N/A'}</span></div>
          </div>

          <div class="section">
            <div class="section-title">Payment Information</div>
            <div class="field"><span class="label">Status:</span><span class="value">${schoolData.payment_status || 'N/A'}</span></div>
            <div class="field"><span class="label">Registration Date:</span><span class="value">${schoolData.registration_date || 'N/A'}</span></div>
          </div>

          <div class="section">
            <div class="section-title">Verification</div>
            <p>This is a hard copy backup of the digital registration. For online verification, visit:</p>
            <p>https://napps-northcentral.com/verify?id=${schoolData.school_id}</p>
          </div>

          <div class="footer">
            <p>Powered by Pre-Campus Computers & Pre Campus College Schs Ltd</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <button onclick="window.print()" style="padding: 10px 20px; margin-top: 20px; cursor: pointer;">Print Form</button>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }

    toast.success('Hard copy form generated!');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Offline Backup</h1>
            <p className="text-slate-600 mt-2">Generate hard copy backup in case of network failure</p>
          </div>

          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Use this page to generate offline backups of school registration data when network is unavailable on-site.
            </AlertDescription>
          </Alert>

          {/* Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search School</CardTitle>
              <CardDescription>Enter school ID to generate backup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="schoolId">School ID</Label>
                  <Input 
                    id="schoolId"
                    value={schoolId}
                    onChange={e => setSchoolId(e.target.value.toUpperCase())}
                    placeholder="e.g., NC-ABC12345"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* School Data */}
          {schoolData && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{schoolData.name}</CardTitle>
                    <CardDescription>ID: {schoolData.school_id}</CardDescription>
                  </div>
                  <Badge className={
                    schoolData.payment_status === 'completed' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }>
                    {schoolData.payment_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-slate-500">Proprietor</p>
                    <p className="font-medium">{schoolData.proprietor_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-medium">{schoolData.lga}, {schoolData.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Type</p>
                    <p className="font-medium">{schoolData.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Registration Date</p>
                    <p className="font-medium">{schoolData.registration_date || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={generatePDF} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={generateHardCopyForm} variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Hard Copy
                  </Button>
                  <Button onClick={() => window.print()} variant="outline" className="flex-1">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions for On-Site Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                <li>Search for school using School ID</li>
                <li>If network is available, complete online registration after payment</li>
                <li>If network fails, generate hard copy form using "Generate Hard Copy" button</li>
                <li>Fill the hard copy form manually on-site</li>
                <li>Later, upload the data when network is restored</li>
                <li>All hard copies must be provided as backup</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}


