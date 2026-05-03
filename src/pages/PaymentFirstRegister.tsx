import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, CreditCard, UserPlus, Loader2, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TOTAL_DUES, NORTH_CENTRAL_STATES } from "@/constants/north-central-config";

interface PaymentData {
  reference: string;
  amount: number;
  status: string;
  proprietor_id?: string;
  token?: string;
}

export default function PaymentFirstRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'payment' | 'verify' | 'registration'>('payment');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    state: '',
    lga: '',
    passport_photo_url: '',
    chapters: [] as string[],
    // School Info
    school_name: '',
    school_type: '',
    school_category: '',
    school_address: '',
    total_enrollment: 0,
  });

  // Check for existing token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registration_tokens')
        .select('*, payments!inner(*)')
        .eq('token', token)
        .eq('is_used', false)
        .single();

      if (error || !data) {
        throw new Error('Invalid or expired registration token');
      }

      if (new Date(data.expires_at) < new Date()) {
        throw new Error('Registration token has expired');
      }

      setPaymentData({
        reference: data.payments.reference,
        amount: data.payments.amount,
        status: data.payments.status,
        proprietor_id: data.proprietor_id,
        token: data.token,
      });
      setStep('registration');
      toast.success('Token verified! You can now complete registration.');
    } catch (error: any) {
      toast.error(error.message || 'Invalid token');
      navigate('/register');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get form data for payment
      const form = e.target as HTMLFormElement;
      const email = (form.elements.namedItem('email') as HTMLInputElement).value;
      const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
      const state = (form.elements.namedItem('state') as HTMLSelectElement).value;

      if (!email || !phone || !state) {
        throw new Error('Please fill all required fields');
      }

      // Generate payment reference
      const reference = `NAPPS-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Create payment record (status: pending)
      const { data: payment, error } = await supabase
        .from('payments')
        .insert([{
          reference,
          amount: TOTAL_DUES,
          dues_breakdown: {
            local: 6000,
            state: 4000,
            zonal: 2000,
            national: 5000,
            id_card: 3500
          },
          status: 'pending',
          payment_method: 'opay'
        }])
        .select()
        .single();

      if (error) throw error;

      setPaymentData({
        reference: payment.reference,
        amount: payment.amount,
        status: payment.status,
      });

      // In production: Redirect to Opay payment gateway
      // For now, simulate payment completion
      toast.success('Payment initiated! Reference: ' + reference);
      
      // Simulate payment verification (in production, this would be a callback)
      setTimeout(() => {
        handlePaymentVerification(reference, email, phone, state);
      }, 2000);

    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentVerification = async (reference: string, email: string, phone: string, state: string) => {
    setLoading(true);
    try {
      // Update payment status to completed
      const { error: paymentError } = await supabase
        .from('payments')
        .update({ 
          status: 'completed',
          payment_date: new Date().toISOString()
        })
        .eq('reference', reference);

      if (paymentError) throw paymentError;

      // Generate registration token
      const token = `REG-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      const { error: tokenError } = await supabase
        .from('registration_tokens')
        .insert([{
          token,
          payment_reference: reference,
          expires_at: expiresAt.toISOString(),
        }]);

      if (tokenError) throw tokenError;

      setPaymentData({
        reference,
        amount: TOTAL_DUES,
        status: 'completed',
        token,
      });
      setStep('registration');

      toast.success('Payment verified! Use token to complete registration.');
      
      // Redirect to registration with token
      navigate(`/register?token=${token}`);
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!paymentData?.token) {
        throw new Error('No valid registration token');
      }

      // Create proprietor
      const { data: proprietor, error: propError } = await supabase
        .from('proprietors')
        .insert([{
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          state: formData.state,
          lga: formData.lga,
          chapters: formData.chapters,
        }])
        .select()
        .single();

      if (propError) throw propError;

      // Create school
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert([{
          name: formData.school_name,
          state: formData.state,
          lga: formData.lga,
          chapter: formData.chapters[0] || '',
          proprietor_id: proprietor.id,
          type: formData.school_type,
          category: formData.school_category,
          address: formData.school_address,
          total_enrollment: formData.total_enrollment,
          status: 'approved',
          last_payment_date: new Date().toISOString(),
        }])
        .select()
        .single();

      if (schoolError) throw schoolError;

      // Mark token as used
      await supabase
        .from('registration_tokens')
        .update({ 
          is_used: true, 
          used_at: new Date().toISOString(),
          proprietor_id: proprietor.id,
          school_id: school.id 
        })
        .eq('token', paymentData.token);

      // Update payment with school info
      await supabase
        .from('payments')
        .update({ 
          proprietor_id: proprietor.id,
          school_id: school.id,
          school_id_text: school.school_id,
          registration_completed: true 
        })
        .eq('reference', paymentData.reference);

      // Update state totals
      await supabase.rpc('increment_state_schools', { state_name: formData.state });

      toast.success('Registration completed successfully!');
      navigate(`/payment-success?school_id=${school.school_id}`);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <UserPlus className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">School Registration</h1>
            <p className="text-slate-600 mt-2">Payment required before registration</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {[
                { num: 1, title: 'Payment', desc: 'Pay dues' },
                { num: 2, title: 'Verify', desc: 'Verify payment' },
                { num: 3, title: 'Register', desc: 'Complete form' },
              ].map(({ num, title, desc }) => (
                <div key={num} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    (step === 'payment' && num === 1) || (step === 'verify' && num <= 2) || (step === 'registration' && num === 3)
                      ? 'bg-emerald-600 text-white' 
                      : step === 'registration' && num < 3
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    {(step === 'registration' && num < 3) ? <CheckCircle2 className="w-5 h-5" /> : num}
                  </div>
                  <div className="hidden sm:block ml-3">
                    <p className={`text-sm font-medium ${step === 'registration' || (step === 'verify' && num <= 2) || (step === 'payment' && num === 1) ? 'text-slate-900' : 'text-slate-500'}`}>{title}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Progress value={
              step === 'payment' ? 33 : step === 'verify' ? 66 : 100
            } className="h-2 bg-slate-200" />
          </div>

          {/* Payment Step */}
          {step === 'payment' && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-6">
                <CardTitle className="text-xl">Step 1: Make Payment</CardTitle>
                <CardDescription className="text-slate-300">
                  Total Amount: ₦{TOTAL_DUES.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <Alert className="mb-6 border-emerald-200 bg-emerald-50">
                  <AlertCircle className="w-5 h-5 text-emerald-600" />
                  <AlertDescription className="text-emerald-700">
                    Payment must be completed before accessing the registration form.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" required placeholder="proprietor@school.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" required placeholder="+234..." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <select id="state" required className="w-full px-3 py-2 border border-slate-300 rounded-md">
                      <option value="">Select State</option>
                      {NORTH_CENTRAL_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                    <h4 className="font-medium">Payment Breakdown:</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between"><span>State Dues:</span><span>₦4,000</span></div>
                      <div className="flex justify-between"><span>Zonal Dues:</span><span>₦2,000</span></div>
                      <div className="flex justify-between"><span>National Dues:</span><span>₦5,000</span></div>
                      <div className="flex justify-between"><span>ID Card:</span><span>₦3,500</span></div>
                      <div className="flex justify-between font-bold border-t pt-2"><span>Total:</span><span>₦{TOTAL_DUES.toLocaleString()}</span></div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                    Proceed to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Registration Step */}
          {step === 'registration' && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-6">
                <CardTitle className="text-xl">Step 2: Complete Registration</CardTitle>
                <CardDescription className="text-slate-300">
                  Payment verified! Now complete your registration.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name *</Label>
                        <Input id="first_name" required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="middle_name">Middle Name</Label>
                        <Input id="middle_name" value={formData.middle_name} onChange={e => setFormData({...formData, middle_name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name *</Label>
                        <Input id="last_name" required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* School Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">School Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="school_name">School Name *</Label>
                        <Input id="school_name" required value={formData.school_name} onChange={e => setFormData({...formData, school_name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="school_type">School Type *</Label>
                        <select id="school_type" required className="w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.school_type} onChange={e => setFormData({...formData, school_type: e.target.value})}>
                          <option value="">Select Type</option>
                          <option value="Nursery">Nursery</option>
                          <option value="Primary">Primary</option>
                          <option value="Secondary">Secondary</option>
                          <option value="Mixed">Mixed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                    Complete Registration
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
