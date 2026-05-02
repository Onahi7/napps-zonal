import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NORTH_CENTRAL_STATES } from "@/constants/north-central-config";
import { Shield, Award, Users, Briefcase } from "lucide-react";

const executives = {
  zonal: [
    { name: "Dr. Rahaman Adetunji Lateef", position: "Zonal President", phone: "+234-XXX-XXX-XXXX", state: "North Central", image: "/president.jpg" },
    { name: "Hon. Boniface Iornumbe", position: "Vice President", phone: "+234-XXX-XXX-XXXX", state: "North Central", image: "/vice-president.jpg" },
    { name: "Harrison Eze", position: "Zonal Welfare", phone: "+234-XXX-XXX-XXXX", state: "North Central", image: "/zonal-welfare.jpg" },
  ],
  national: [
    { name: "Chief (Dr.) Olufemi Olaleye", position: "National President", phone: "+234-XXX-XXX-XXXX", state: "Lagos" },
    { name: "Alhaji Ali B. Tukur", position: "National Secretary", phone: "+234-XXX-XXX-XXXX", state: "Kano" },
  ]
};

const stateChairmen = [
  { state: "Benue", name: "Dr. Augustine O. Ikyernum", phone: "+234-XXX-XXX-XXXX" },
  { state: "Kogi", name: "Alhaji Oluwafemi A. Segun", phone: "+234-XXX-XXX-XXXX" },
  { state: "Kwara", name: "Barr. Abdulkadir A. Jimoh", phone: "+234-XXX-XXX-XXXX" },
  { state: "Niger", name: "Mallam Sani L. Kontagora", phone: "+234-XXX-XXX-XXXX" },
  { state: "Nasarawa", name: "Chief Mrs. Jummai A. Mohammed", phone: "+234-XXX-XXX-XXXX" },
  { state: "Plateau", name: "Rev. Dr. Timothy D. Zonk", phone: "+234-XXX-XXX-XXXX" },
  { state: "FCT", name: "Barr. Ngozi C. Okonkwo", phone: "+234-XXX-XXX-XXXX" },
];

export default function Executives() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              NAPPS North Central Leadership
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Meet the executive council leading the National Association of Proprietors of Private Schools 
              across the North Central Zone.
            </p>
          </div>

          {/* Zonal Executive Council */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Zonal Executive Council</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {executives.zonal.map((exec, idx) => (
                <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {exec.image ? (
                        <img 
                          src={exec.image} 
                          alt={exec.name}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {exec.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{exec.name}</h3>
                        <Badge className="mt-1 bg-emerald-100 text-emerald-700 text-xs">
                          {exec.position}
                        </Badge>
                        <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {exec.state} Zone
                        </p>
                        <p className="text-sm text-slate-600 mt-1">{exec.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* National Executive */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">National Executive Council</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {executives.national.map((exec, idx) => (
                <Card key={idx} className="border-0 shadow-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {exec.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{exec.name}</h3>
                        <Badge className="mt-1 bg-white/20 text-white text-xs">
                          {exec.position}
                        </Badge>
                        <p className="text-sm text-slate-300 mt-2">{exec.state} State</p>
                        <p className="text-sm text-slate-400 mt-1">{exec.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* State Chairmen */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">State Chapter Chairmen</h2>
            </div>

            <Card className="border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100 text-sm">
                      <tr>
                        <th className="text-left px-6 py-4 text-slate-600 font-semibold">State</th>
                        <th className="text-left px-6 py-4 text-slate-600 font-semibold">Name</th>
                        <th className="text-left px-6 py-4 text-slate-600 font-semibold">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {stateChairmen.map((chair, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                              {chair.state}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900">{chair.name}</td>
                          <td className="px-6 py-4 text-slate-600">{chair.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact CTA */}
          <Card className="mt-12 border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Need to Contact an Executive?</h3>
              <p className="text-emerald-100 mb-4 max-w-lg mx-auto">
                Reach out to the NAPPS North Central Zone secretariat for any inquiries regarding 
                membership, dues, or general association matters.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:info@napps-northcentral.com" className="px-6 py-2 bg-white text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                  Email Secretariat
                </a>
                <a href="tel:+2348012345678" className="px-6 py-2 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                  Call Now
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
