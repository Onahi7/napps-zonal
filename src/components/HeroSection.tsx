import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, Users, CreditCard, Shield, ChevronRight, 
  CheckCircle2, Star, ArrowRight
} from 'lucide-react';
import { NORTH_CENTRAL_STATES } from '@/constants/north-central-config';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">NAPPS North Central Zone Official Portal</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Register Your School with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  NAPPS
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto lg:mx-0">
                The official portal for private school proprietors across 7 states. 
                Pay dues, get your School ID, and join the largest association of private schools in Nigeria.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-xl text-white font-semibold px-8"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Register Now
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/dues-payment">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay Dues
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
              {[
                { icon: Shield, label: '7 States Covered' },
                { icon: Users, label: '5000+ Schools' },
                { icon: CheckCircle2, label: 'Official Portal' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-slate-300">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Stats Card */}
          <div className="hidden lg:block">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <p className="text-sm text-emerald-300 font-medium mb-2">Total Dues Payable</p>
                  <p className="text-5xl font-bold text-white">₦14,500</p>
                  <p className="text-sm text-slate-400 mt-1">One-time payment</p>
                </div>
                
                <div className="space-y-3 border-t border-white/10 pt-6">
                  {[
                    { label: 'State Dues', amount: '₦4,000' },
                    { label: 'Zonal Dues', amount: '₦2,000' },
                    { label: 'National Dues', amount: '₦5,000' },
                    { label: 'NAPPS ID Card', amount: '₦3,500' },
                  ].map(({ label, amount }) => (
                    <div key={label} className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">{label}</span>
                      <span className="font-medium text-white">{amount}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link to="/dues-payment">
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                      Pay Dues Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
