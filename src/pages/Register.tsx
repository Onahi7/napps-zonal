import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, UserPlus, Loader2 } from "lucide-react";
import { Step1PersonalInfo, Step2SchoolInfo, Step3PaymentInfo } from "@/components/registration";
import { toast } from "sonner";

interface RegistrationData {
  personalInfo?: any;
  schoolInfo?: any;
  paymentInfo?: any;
  submissionId?: string;
}

const STORAGE_KEY = 'napps_registration_progress';

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResume, setShowResume] = useState(false);

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRegistrationData(parsed);
        if (parsed.submissionId) {
          setShowResume(true);
        }
      } catch (e) {
        console.error('Failed to load saved progress', e);
      }
    }
  }, []);

  const saveProgress = (data: RegistrationData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      timestamp: Date.now()
    }));
  };

  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRegistrationData({});
    setShowResume(false);
  };

  const steps = [
    { num: 1, title: 'Personal Info', desc: 'Your details' },
    { num: 2, title: 'School Info', desc: 'School details' },
    { num: 3, title: 'Payment', desc: 'Complete payment' },
  ];

  const handleStep1Submit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Simulate save - in real app, would call Supabase
      const updatedData = {
        ...registrationData,
        personalInfo: data,
        submissionId: `SUB-${Date.now().toString(36).toUpperCase()}`
      };
      setRegistrationData(updatedData);
      saveProgress(updatedData);
      toast.success('Personal information saved');
      setCurrentStep(2);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Submit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const updatedData = {
        ...registrationData,
        schoolInfo: data
      };
      setRegistrationData(updatedData);
      saveProgress(updatedData);
      toast.success('School information saved');
      setCurrentStep(3);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep3Submit = async (data: any) => {
    setIsSubmitting(true);
    try {
      toast.success('Payment initiated! Redirecting...');
      // In real app, would redirect to payment gateway
      setTimeout(() => {
        navigate('/dues-payment');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-3xl font-bold text-slate-900">Register Your School</h1>
            <p className="text-slate-600 mt-2">Complete all steps to get your NAPPS School ID</p>
          </div>

          {/* Resume Alert */}
          {showResume && (
            <Alert className="mb-6 border-emerald-200 bg-emerald-50">
              <AlertCircle className="w-5 h-5 text-emerald-600" />
              <AlertDescription className="text-emerald-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span>You have a saved registration. Would you like to continue?</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={clearProgress} className="border-emerald-300">
                      Start Fresh
                    </Button>
                    <Button size="sm" onClick={() => setShowResume(false)} className="bg-emerald-600 hover:bg-emerald-700">
                      Continue
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {steps.map(({ num, title, desc }) => (
                <div key={num} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    currentStep > num 
                      ? 'bg-emerald-500 text-white' 
                      : currentStep === num 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    {currentStep > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                  </div>
                  <div className="hidden sm:block ml-3">
                    <p className={`text-sm font-medium ${currentStep >= num ? 'text-slate-900' : 'text-slate-500'}`}>{title}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2 bg-slate-200" />
          </div>

          {/* Step Cards */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-6">
              <CardTitle className="text-xl">
                Step {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              {currentStep === 1 && (
                <Step1PersonalInfo
                  initialData={registrationData.personalInfo}
                  onSubmit={handleStep1Submit}
                  isSubmitting={isSubmitting}
                />
              )}
              {currentStep === 2 && (
                <Step2SchoolInfo
                  initialData={registrationData.schoolInfo}
                  onSubmit={handleStep2Submit}
                  onBack={() => setCurrentStep(1)}
                  isSubmitting={isSubmitting}
                />
              )}
              {currentStep === 3 && (
                <Step3PaymentInfo
                  initialData={registrationData.paymentInfo}
                  onSubmit={handleStep3Submit}
                  onBack={() => setCurrentStep(2)}
                  isSubmitting={isSubmitting}
                />
              )}
            </CardContent>
          </Card>

          {/* Help */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>Need help? Contact us at <a href="mailto:support@napps-northcentral.com" className="text-emerald-600 hover:underline">support@napps-northcentral.com</a></p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
