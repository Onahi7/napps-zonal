import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Loader2, Building2 } from "lucide-react";
import { NORTH_CENTRAL_STATES } from "@/constants/north-central-config";
import { NORTH_CENTRAL_LGAS } from "@/lib/northCentralLgas";

interface Step2SchoolInfoProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function Step2SchoolInfo({ initialData, onSubmit, onBack, isSubmitting }: Step2SchoolInfoProps) {
  const [formData, setFormData] = useState({
    schoolName: initialData?.schoolName || "",
    schoolType: initialData?.schoolType || "",
    schoolAddress: initialData?.schoolAddress || "",
    state: initialData?.state || "",
    lga: initialData?.lga || "",
    schoolEmail: initialData?.schoolEmail || "",
    schoolPhone: initialData?.schoolPhone || ""
  });

  const [lgas, setLgas] = useState<string[]>([]);

  useEffect(() => {
    if (formData.state) {
      setLgas(NORTH_CENTRAL_LGAS[formData.state] || []);
    }
  }, [formData.state]);

  useEffect(() => {
    if (initialData?.state) {
      setLgas(NORTH_CENTRAL_LGAS[initialData.state] || []);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">School Information</h3>
          <p className="text-sm text-slate-500">Enter your school's registered details</p>
        </div>
      </div>

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
        <Label htmlFor="schoolType">School Type</Label>
        <select
          id="schoolType"
          value={formData.schoolType}
          onChange={(e) => setFormData({...formData, schoolType: e.target.value})}
          required
          className="flex h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">Select type...</option>
          <option value="nursery">Nursery</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="nursery_primary">Nursery & Primary</option>
          <option value="primary_secondary">Primary & Secondary</option>
          <option value="nursery_primary_secondary">Nursery, Primary & Secondary</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <select
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value, lga: ""})}
            required
            className="flex h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select state...</option>
            {NORTH_CENTRAL_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lga">Local Government Area</Label>
          <select
            id="lga"
            value={formData.lga}
            onChange={(e) => setFormData({...formData, lga: e.target.value})}
            required
            disabled={!formData.state}
            className="flex h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">Select LGA...</option>
            {lgas.map((lga) => (
              <option key={lga} value={lga}>{lga}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schoolAddress">School Address</Label>
        <Input
          id="schoolAddress"
          placeholder="Plot 45, Ado Street, New Layout"
          value={formData.schoolAddress}
          onChange={(e) => setFormData({...formData, schoolAddress: e.target.value})}
          required
          className="h-12"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="schoolEmail">School Email</Label>
          <Input
            id="schoolEmail"
            type="email"
            placeholder="info@abcschool.com"
            value={formData.schoolEmail}
            onChange={(e) => setFormData({...formData, schoolEmail: e.target.value})}
            required
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="schoolPhone">School Phone</Label>
          <Input
            id="schoolPhone"
            type="tel"
            placeholder="08012345678"
            value={formData.schoolPhone}
            onChange={(e) => setFormData({...formData, schoolPhone: e.target.value})}
            required
            className="h-12"
          />
        </div>
      </div>

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
          className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
