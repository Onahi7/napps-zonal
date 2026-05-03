import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Menu, X, Home, UserPlus, CreditCard, LogIn, LogOut,
  ChevronDown, MapPin, Phone, Mail, Shield, Users
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation - only Home and Executives visible to public
  // Register, Pay Dues, Login, Offline Backup are internal consultant tools
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/executives', label: 'Executives', icon: Users },
  ];

  // Field team quick access links (hidden from public nav)
  const fieldTeamLinks = [
    { to: '/register', label: 'Register', icon: UserPlus },
    { to: '/dues-payment', label: 'Pay Dues', icon: CreditCard },
    { to: '/proprietor-login', label: 'Login', icon: LogIn },
    { to: '/offline-backup', label: 'Offline Backup', icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="NAPPS Logo" 
                className="w-10 h-10 rounded-lg object-contain bg-white p-1 shadow-md group-hover:shadow-lg transition-shadow"
              />
              <div className="hidden sm:block">
                <span className="font-bold text-slate-900 text-lg">NAPPS</span>
                <span className="text-xs text-slate-500 block -mt-1">North Central Zone</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === to
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/register">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register School
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <nav className="flex flex-col gap-1">
                {navItems.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      location.pathname === to
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t border-slate-200">
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register School
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="NAPPS Logo" 
                  className="w-10 h-10 rounded-lg object-contain bg-white p-1"
                />
                <div>
                  <span className="font-bold text-white text-lg">NAPPS</span>
                  <span className="text-xs text-slate-400 block">North Central Zone</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                Official portal for private school proprietors across Benue, Kogi, Kwara, Niger, Nasarawa, Plateau & FCT.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/executives" className="hover:text-white transition-colors">Executives</Link></li>
                <li><Link to="/verify" className="hover:text-white transition-colors">Verify School ID</Link></li>
              </ul>
            </div>

            {/* States */}
            <div>
              <h4 className="text-white font-semibold mb-4">States Covered</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {['Benue', 'Kogi', 'Kwara', 'Niger', 'Nasarawa', 'Plateau', 'FCT'].map((state) => (
                  <span key={state} className="text-slate-400">{state}</span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <a href="mailto:info@napps-northcentral.com" className="hover:text-white transition-colors">
                    info@napps-northcentral.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <a href="tel:+2348012345678" className="hover:text-white transition-colors">
                    +234 801 234 5678
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>North Central Zonal Secretariat</span>
                </li>
              </ul>
            </div>

            {/* Powered By */}
            <div>
              <h4 className="text-white font-semibold mb-4">Powered By</h4>
              <div className="p-3 bg-slate-800 rounded-lg">
                <p className="text-sm font-medium text-emerald-400">Pre-Campus Computers</p>
                <p className="text-xs text-slate-400 mt-1">& Pre Campus College Schs Ltd</p>
                <p className="text-xs text-slate-500 mt-2">Official Technology Partner</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} NAPPS North Central Zone. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-3 h-3" />
              <span>Authorized by NAPPS National Executive Council</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
