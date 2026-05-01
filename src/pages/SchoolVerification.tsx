import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, XCircle, Building2, User, MapPin, 
  Phone, Mail, Calendar, Loader2, Printer, Download
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

export default function SchoolVerification() {
  const [searchParams] = useSearchParams();
  const schoolId = searchParams.get('id') || searchParams.get('school_id');
  const [loading, setLoading] = useState(true);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (schoolId) {
      fetchSchoolData(schoolId);
    } else {
      setError('No school ID provided');
      setLoading(false);
    }
  }, [schoolId]);

  const fetchSchoolData = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_school_public_info', { school_id_text: id });

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('School not found');
      }

      setSchoolData(data[0]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch school data');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </Layout>
    );
  }

  if (error || !schoolData) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
              <p className="text-slate-600">{error || 'School not found'}</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900">School Verification</h1>
            <p className="text-slate-600 mt-2">NAPPS North Central Zone</p>
          </div>

          {/* School Info Card */}
          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{schoolData.name}</CardTitle>
                  <p className="text-emerald-100 mt-1">ID: {schoolData.school_id}</p>
                </div>
                <Badge className="bg-white text-emerald-700">Verified</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">School Type</p>
                      <p className="font-medium">{schoolData.type || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Location</p>
                      <p className="font-medium">{schoolData.lga}, {schoolData.state}</p>
                      {schoolData.chapter && (
                        <p className="text-sm text-slate-500">{schoolData.chapter} Chapter</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Proprietor</p>
                      <p className="font-medium">{schoolData.proprietor_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Contact</p>
                      <p className="font-medium">{schoolData.proprietor_phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Registration Date</p>
                    <p className="font-medium">
                      {schoolData.registration_date 
                        ? new Date(schoolData.registration_date).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Payment Status</p>
                    <Badge className={
                      schoolData.payment_status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }>
                      {schoolData.payment_status || 'Unknown'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print Details
            </Button>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-500">
            <p>This verification was generated from the official NAPPS North Central Zone Portal</p>
            <p className="mt-1">Powered by Pre-Campus Computers</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
