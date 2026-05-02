import { Link } from 'react-router-dom';
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, Users, CreditCard, Shield, QrCode, 
  ChevronRight, CheckCircle2, ArrowRight, Star, 
  FileText, Download, Building2, TrendingUp, Lock, Smartphone
} from 'lucide-react';
import { NORTH_CENTRAL_STATES, DUES_STRUCTURE } from '@/constants/north-central-config';

const Index = () => {
  return (
    <Layout>
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { label: 'States Covered', value: '7', icon: MapPin, color: 'emerald' },
              { label: 'LGAs Supported', value: '121+', icon: Building2, color: 'blue' },
              { label: 'Registered Schools', value: '5,000+', icon: Users, color: 'violet' },
              { label: 'Years Active', value: '15+', icon: Shield, color: 'amber' },
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-xl bg-${color}-100 text-${color}-600 flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{value}</p>
                  <p className="text-sm text-slate-600 mt-1">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* States Coverage */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              7 States, One Platform
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              NAPPS North Central Zone covers all states in the North Central Geopolitical Zone. 
              Register once, access benefits across all states.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {NORTH_CENTRAL_STATES.map((state) => (
              <Card key={state} className="border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{state}</h3>
                  <p className="text-xs text-slate-500 mt-1">Nigeria</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple 3-step process to register your school and get your official NAPPS ID
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: Users,
                title: 'Visit Schools',
                desc: 'NAPPS field team visits private schools across all 7 states',
                color: 'emerald',
              },
              {
                step: 2,
                icon: CreditCard,
                title: 'Collect Dues',
                desc: 'Field team collects membership dues on-site',
                color: 'blue',
              },
              {
                step: 3,
                icon: QrCode,
                title: 'Issue ID',
                desc: 'Schools receive official NAPPS ID with QR verification',
                color: 'violet',
              },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <Card key={step} className="border-0 shadow-lg relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-50 rounded-bl-full`} />
                <CardContent className="p-8 relative">
                  <div className={`w-14 h-14 rounded-2xl bg-${color}-100 text-${color}-600 flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className={`text-5xl font-bold text-${color}-100 mb-4`}>{step}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-600">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dues Info */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Membership Dues
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                One-time registration covering all levels of NAPPS membership. 
                Contact the zonal secretariat for current dues structure.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div>
                    <p className="font-semibold text-white">Local Dues</p>
                    <p className="text-sm text-slate-400">Chapter-level operations</p>
                  </div>
                  <p className="text-xl font-bold text-emerald-400">ContactUs</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div>
                    <p className="font-semibold text-white">State Dues</p>
                    <p className="text-sm text-slate-400">State chapter activities</p>
                  </div>
                  <p className="text-xl font-bold text-emerald-400">ContactUs</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div>
                    <p className="font-semibold text-white">Zonal Dues</p>
                    <p className="text-sm text-slate-400">Zone coordination</p>
                  </div>
                  <p className="text-xl font-bold text-emerald-400">ContactUs</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
              <div className="text-center mb-6">
                <p className="text-sm text-emerald-300 font-medium">For Registration</p>
                <p className="text-5xl font-bold text-white mt-2">Contact Field Team</p>
                <p className="text-slate-400 mt-4">Speak with NAPPS representatives in your state for accurate dues information and registration.</p>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">NAPPS ID Card</span>
                  <span className="text-emerald-400">Included</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">QR Code Verification</span>
                  <span className="text-emerald-400">Standard</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-slate-400">
                  Field teams visit schools in each state to collect dues and register members.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Leadership Preview */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Executive Leadership
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Meet the dedicated team leading NAPPS North Central Zone
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { name: "Prof. Emmanuel O. Adeleye", position: "Zonal President", state: "Nasarawa" },
              { name: "Dr. Grace A. Kolo", position: "Vice President", state: "Plateau" },
              { name: "Barr. Ibrahim Y. Katun", position: "Zonal Secretary", state: "Niger" },
            ].map(({ name, position, state }) => (
              <Card key={name} className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <h3 className="font-bold text-slate-900">{name}</h3>
                  <p className="text-emerald-600 text-sm font-medium">{position}</p>
                  <p className="text-slate-500 text-xs mt-1">{state} State</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/executives">
              <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                View All Executives
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 mb-6">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white">Serving private schools across 7 states</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            About NAPPS North Central Zone
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            The National Association of Proprietors of Private Schools (NAPPS) North Central Zone 
            represents and supports private educational institutions across Benue, Kogi, Kwara, Niger, 
            Nasarawa, Plateau, and the FCT.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/executives">
              <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 font-semibold shadow-lg">
                <Users className="w-5 h-5 mr-2" />
                Meet Our Executives
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              System Features
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A comprehensive platform built for efficient dues collection, data management, and member verification
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: CreditCard, title: 'Centralized Dues Payment', desc: 'Process all payments through Opay gateway with real-time confirmation' },
              { icon: TrendingUp, title: 'Automated Fund Reconciliation', desc: 'Automatic allocation to National, Zonal, State, and Chapter levels' },
              { icon: Users, title: 'Real-time Dashboard', desc: 'Monitor payments, compliance, and member status instantly' },
              { icon: QrCode, title: 'Unique School ID System', desc: 'Every school gets a unique NC-XXXXXXXX identification code' },
              { icon: Smartphone, title: 'QR-based ID Cards', desc: 'Official NAPPS ID cards with QR codes for instant verification' },
              { icon: Lock, title: 'Secure Data Management', desc: 'Protected member data with role-based access control' },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-600">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
