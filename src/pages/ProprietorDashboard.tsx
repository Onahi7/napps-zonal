import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, User, Building2, MapPin, Phone, Mail, CreditCard, Shield, CheckCircle2, LogOut, Settings, Bell } from "lucide-react";

export default function ProprietorDashboard() {
  const [showIdCard, setShowIdCard] = useState(true);

  const schoolData = {
    schoolId: "NC-8A3F2B1C",
    schoolName: "ABC Private School",
    proprietorName: "Dr. John Doe",
    email: "johndoe@abcschool.com",
    phone: "08012345678",
    state: "Nasarawa",
    lga: "Lafia",
    address: "Plot 45, Ado Street, Lafia",
    paymentStatus: "paid",
    registrationDate: "May 1, 2026",
    validUntil: "December 2026",
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-xl">
                  🏫
                </div>
                <div>
                  <h1 className="text-xl font-bold">{schoolData.schoolName}</h1>
                  <p className="text-slate-300 text-sm flex items-center gap-2">
                    <span className="font-mono">{schoolData.schoolId}</span>
                    <Badge className="bg-emerald-500 text-white text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Settings className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ID Card Section */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-xl overflow-hidden sticky top-24">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold">NAPPS</h2>
                      <p className="text-emerald-200 text-xs">North Central Zone</p>
                    </div>
                    <Badge className="bg-white/20 text-white text-xs">
                      Official ID
                    </Badge>
                  </div>

                  <div className="bg-white rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-2xl">
                        🏫
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-sm">{schoolData.schoolName}</h3>
                        <p className="text-xs text-slate-600">{schoolData.proprietorName}</p>
                        <p className="text-xs text-slate-500 mt-1">{schoolData.state} • {schoolData.lga}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="text-xs">
                      <p className="text-emerald-200">Valid Until</p>
                      <p className="font-medium">{schoolData.validUntil}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <QrCode className="w-12 h-12 text-slate-800" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 bg-slate-50">
                  <div className="flex flex-col gap-2">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download ID Card
                    </Button>
                    <Button variant="outline" className="w-full">
                      Share QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info & Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">₦14,500</p>
                      <p className="text-sm text-slate-500">Total Paid</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">Active</p>
                      <p className="text-sm text-slate-500">Membership Status</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">2026</p>
                      <p className="text-sm text-slate-500">Valid Through</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* School Information */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-slate-100">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    School Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-slate-500">School Name</label>
                        <p className="font-medium text-slate-900">{schoolData.schoolName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-slate-500">Proprietor</label>
                        <p className="font-medium text-slate-900">{schoolData.proprietorName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-slate-500">Registration Date</label>
                        <p className="font-medium text-slate-900">{schoolData.registrationDate}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-slate-500">School ID</label>
                        <p className="font-mono font-medium text-emerald-600">{schoolData.schoolId}</p>
                      </div>
                      <div>
                        <label className="text-sm text-slate-500">State / LGA</label>
                        <p className="font-medium text-slate-900">{schoolData.state} / {schoolData.lga}</p>
                      </div>
                      <div>
                        <label className="text-sm text-slate-500">Address</label>
                        <p className="font-medium text-slate-900">{schoolData.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit School Info
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-slate-100">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                      <Mail className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="font-medium text-slate-900 text-sm">{schoolData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                      <Phone className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="font-medium text-slate-900 text-sm">{schoolData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs text-slate-500">Location</p>
                        <p className="font-medium text-slate-900 text-sm">{schoolData.lga}, {schoolData.state}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Contact Info
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Dues Payment History */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-slate-100">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 text-sm">
                        <tr>
                          <th className="text-left px-6 py-3 text-slate-500 font-medium">Date</th>
                          <th className="text-left px-6 py-3 text-slate-500 font-medium">Reference</th>
                          <th className="text-left px-6 py-3 text-slate-500 font-medium">Description</th>
                          <th className="text-left px-6 py-3 text-slate-500 font-medium">Amount</th>
                          <th className="text-left px-6 py-3 text-slate-500 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="px-6 py-4 text-sm text-slate-600">{schoolData.registrationDate}</td>
                          <td className="px-6 py-4 font-mono text-sm text-slate-600">NAPPS-{Date.now().toString(36).toUpperCase()}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">Annual Dues (2026)</td>
                          <td className="px-6 py-4 font-medium text-slate-900">₦14,500</td>
                          <td className="px-6 py-4">
                            <Badge className="bg-emerald-100 text-emerald-700">Paid</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Link to="/register">
                      <Button className="w-full h-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                        <Building2 className="w-6 h-6" />
                        <span className="text-sm font-medium">Register Another School</span>
                      </Button>
                    </Link>
                    <Button className="w-full h-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                      <Download className="w-6 h-6" />
                      <span className="text-sm font-medium">Download Receipt</span>
                    </Button>
                    <Button className="w-full h-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                      <Shield className="w-6 h-6" />
                      <span className="text-sm font-medium">Verify School</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
