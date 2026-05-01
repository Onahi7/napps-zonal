import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, QrCode, Loader2, CheckCircle2 } from "lucide-react";

export default function DuesPaymentDownload() {
  const [isGenerating, setIsGenerating] = useState(true);
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    // Simulate ID card generation
    const timer = setTimeout(() => {
      setIsGenerating(false);
      setDownloadReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <QrCode className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Your NAPPS ID Card</h1>
            <p className="text-slate-600 mt-2">Download your official NAPPS School ID card</p>
          </div>

          <Card className="border-0 shadow-xl overflow-hidden">
            {isGenerating ? (
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Generating Your ID Card...</h2>
                <p className="text-slate-600">Please wait while we prepare your card for download.</p>
              </CardContent>
            ) : (
              <div>
                {/* ID Card Preview */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">NAPPS</h2>
                      <p className="text-emerald-200 text-sm">North Central Zone</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-emerald-200">Official ID</p>
                      <p className="font-mono font-bold">NC-8A3F2B1C</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center">
                        <span className="text-2xl">🏫</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">ABC Private School</h3>
                        <p className="text-sm text-slate-600">Dr. John Doe</p>
                        <p className="text-xs text-slate-500 mt-1">Nasarawa State • Lafia LGA</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-emerald-200">Valid Until</p>
                      <p className="font-medium">December 2026</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <QrCode className="w-16 h-16 text-slate-800" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <CardContent className="p-6 bg-slate-50">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-slate-900">ID Card Ready for Download</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                      <Download className="w-5 h-5 mr-2" />
                      Download ID Card (PDF)
                    </Button>
                    <Button variant="outline" className="w-full h-12">
                      <Download className="w-5 h-5 mr-2" />
                      Download Receipt
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-sm text-slate-600 text-center mb-4">
                      Need a physical card? Contact NAPPS North Central Zone secretariat.
                    </p>
                    <Link to="/proprietor-login">
                      <Button variant="link" className="w-full text-emerald-600">
                        Go to Dashboard →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
