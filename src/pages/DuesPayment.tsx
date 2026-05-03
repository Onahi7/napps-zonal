import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { DUES_STRUCTURE } from "@/constants/north-central-config";

export default function DuesPayment() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [reference, setReference] = useState("");

  const [formData, setFormData] = useState({
    schoolName: "",
    proprietorName: "",
    phone: "",
    email: "",
    amount: "20500"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentStep('processing');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const txRef = `NAPPS-${Date.now().toString(36).toUpperCase()}`;
    setReference(txRef);
    setPaymentStep('success');
    setIsProcessing(false);
  };

  if (paymentStep === 'success') {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12">
          <Card className="max-w-md w-full mx-4 border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
              <p className="text-slate-600 mb-6">Your dues payment has been processed successfully.</p>
              
              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-500">Reference</span>
                  <span className="font-mono font-medium text-emerald-600">{reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-slate-900">₦14,500</span>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-6">
                Your NAPPS ID card is being processed. You will receive a notification once it's ready.
              </p>

              <div className="flex flex-col gap-3">
                <Link to="/proprietor-login">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Return Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (paymentStep === 'processing') {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Payment...</h2>
              <p className="text-slate-600">Please wait while we process your payment.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <QrCode className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Pay NAPPS Dues</h1>
            <p className="text-slate-600 mt-2">Complete your payment to receive your NAPPS School ID</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="schoolName">School Name</Label>
                        <Input
                          id="schoolName"
                          placeholder="ABC Private School"
                          value={formData.schoolName}
                          onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proprietorName">Proprietor's Name</Label>
                        <Input
                          id="proprietorName"
                          placeholder="Dr. John Doe"
                          value={formData.proprietorName}
                          onChange={(e) => setFormData({...formData, proprietorName: e.target.value})}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="08012345678"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="school@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <Button 
                        type="submit" 
                        className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-lg font-semibold"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Pay ₦14,500
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl sticky top-24">
                <CardHeader className="bg-slate-100">
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    {[
                      { label: 'State Dues', amount: '₦4,000' },
                      { label: 'Zonal Dues', amount: '₦2,000' },
                      { label: 'National Dues', amount: '₦5,000' },
                      { label: 'NAPPS ID Card', amount: '₦3,500' },
                    ].map(({ label, amount }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-slate-600">{label}</span>
                        <span className="font-medium text-slate-900">{amount}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900">Total</span>
                      <span className="text-2xl font-bold text-emerald-600">₦14,500</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-4 text-sm text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 inline mr-2" />
                    Secure payment via Opay
                  </div>

                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <AlertDescription className="text-amber-700 text-xs">
                      After payment, your NAPPS ID card will be processed within 24-48 hours.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
