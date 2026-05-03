import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Loader2, Shield, AlertCircle } from "lucide-react";

interface Step3PaymentInfoProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function Step3PaymentInfo({ onSubmit, onBack, isSubmitting }: Step3PaymentInfoProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ paymentMethod: 'opay' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Payment Summary</h3>
          <p className="text-sm text-slate-500">Review and complete your payment</p>
        </div>
      </div>

      {/* Dues Breakdown Card */}
      <Card className="border-slate-200">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">State Dues</span>
            <span className="font-medium text-slate-900">₦4,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Zonal Dues</span>
            <span className="font-medium text-slate-900">₦2,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">National Dues</span>
            <span className="font-medium text-slate-900">₦5,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">NAPPS ID Card</span>
            <span className="font-medium text-slate-900">₦3,500</span>
          </div>
          <div className="border-t border-slate-200 pt-3 mt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-900">Total Amount</span>
              <span className="text-2xl font-bold text-emerald-600">₦14,500</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <div className="space-y-4">
        <Label>Payment Method</Label>
        <Card className="border-2 border-emerald-500 bg-emerald-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
              <span className="text-xl font-bold text-emerald-600">O</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Opay</p>
              <p className="text-sm text-slate-600">Pay securely with Opay</p>
            </div>
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
        <Checkbox id="terms" required />
        <Label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
          I confirm that all information provided is accurate and I agree to the{" "}
          <a href="#" className="text-emerald-600 hover:underline">NAPPS Terms & Conditions</a>{" "}
          and{" "}
          <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>.
        </Label>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Shield className="w-4 h-4 text-emerald-600" />
        <span>Your payment is secured with 256-bit SSL encryption</span>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-200 flex gap-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-base font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay ₦14,500
              <CreditCard className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
