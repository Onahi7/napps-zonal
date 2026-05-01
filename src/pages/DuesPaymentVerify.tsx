import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, AlertCircle, Search } from "lucide-react";

export default function DuesPaymentVerify() {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationResult, setVerificationResult] = useState<'idle' | 'found' | 'not_found'>('idle');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult('idle');
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock: accept any query with 4+ chars
    if (searchQuery.length >= 4) {
      setVerificationResult('found');
    } else {
      setVerificationResult('not_found');
    }
    setIsVerifying(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Verify Payment</h1>
            <p className="text-slate-600 mt-2">Enter your transaction reference or school name to verify payment</p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="search">Transaction Reference or School Name</Label>
                  <div className="flex gap-3">
                    <Input
                      id="search"
                      placeholder="NAPPS-XXXXX or ABC School"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      required
                      className="h-12 flex-1"
                    />
                    <Button 
                      type="submit" 
                      className="h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-600"
                      disabled={isVerifying || searchQuery.length < 3}
                    >
                      {isVerifying ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'Verify'
                      )}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Results */}
              {verificationResult === 'found' && (
                <div className="mt-6 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-emerald-900 text-lg">Payment Verified</h3>
                      <p className="text-emerald-700 mt-1">
                        This school has completed their NAPPS registration and dues payment for the current year.
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-emerald-600">School Name</span>
                          <p className="font-medium text-slate-900">ABC Private School</p>
                        </div>
                        <div>
                          <span className="text-emerald-600">School ID</span>
                          <p className="font-mono font-medium text-slate-900">NC-8A3F2B1C</p>
                        </div>
                        <div>
                          <span className="text-emerald-600">State</span>
                          <p className="font-medium text-slate-900">Nasarawa</p>
                        </div>
                        <div>
                          <span className="text-emerald-600">Payment Status</span>
                          <p className="font-medium text-emerald-600">Paid ✓</p>
                        </div>
                      </div>
                      <Button 
                        className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => navigate('/dues-payment-download')}
                      >
                        Download ID Card
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {verificationResult === 'not_found' && (
                <div className="mt-6 p-6 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-900 text-lg">Not Found</h3>
                      <p className="text-red-700 mt-1">
                        No payment record found for "{searchQuery}". Please check the reference and try again, or contact support.
                      </p>
                      <div className="mt-4 flex gap-3">
                        <Button variant="outline" onClick={() => setSearchQuery("")}>
                          Try Again
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/register')}>
                          Register School
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="mt-6 border-slate-200 bg-slate-50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-slate-900 mb-2">Need Help?</h4>
              <p className="text-sm text-slate-600 mb-3">
                If you're having trouble verifying your payment, contact NAPPS support:
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="mailto:support@napps-northcentral.com" className="text-emerald-600 hover:underline">
                  support@napps-northcentral.com
                </a>
                <span className="text-slate-400">|</span>
                <span>+234 801 234 5678</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
