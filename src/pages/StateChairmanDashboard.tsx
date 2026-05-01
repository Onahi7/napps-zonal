import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, Users, DollarSign, TrendingUp, MapPin, 
  CheckCircle2, AlertCircle, Loader2, School, BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NORTH_CENTRAL_STATES } from "@/constants/north-central-config";

interface SchoolInfo {
  id: string;
  school_id: string;
  name: string;
  type: string;
  status: string;
  total_enrollment: number;
  proprietor_name: string;
  payment_status: string;
  last_payment: string;
}

interface StateSummary {
  total_schools: number;
  total_proprietors: number;
  total_revenue: number;
  completed_payments: number;
  pending_payments: number;
  active_schools: number;
}

export default function StateChairmanDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "", state: "" });
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<SchoolInfo[]>([]);
  const [stateSummary, setStateSummary] = useState<StateSummary | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'overview' | 'schools' | 'financial'>('overview');

  useEffect(() => {
    const token = localStorage.getItem('state_admin_token');
    if (token) {
      const savedState = localStorage.getItem('state_admin_state');
      if (savedState) {
        setSelectedState(savedState);
        setIsAuthenticated(true);
        fetchData(savedState);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', loginForm.email)
        .eq('role', 'state_chairman')
        .eq('state', loginForm.state)
        .single();

      if (error || !data) {
        throw new Error('Invalid credentials or state');
      }

      if (data.password_hash !== loginForm.password) {
        throw new Error('Invalid credentials');
      }

      localStorage.setItem('state_admin_token', loginForm.email);
      localStorage.setItem('state_admin_state', loginForm.state);
      setSelectedState(loginForm.state);
      setIsAuthenticated(true);
      fetchData(loginForm.state);
      toast.success(`Welcome, ${loginForm.state} Chairman!`);
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (state: string) => {
    setLoading(true);
    try {
      // Fetch schools in state
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select(`
          id, school_id, name, type, status, total_enrollment, state,
          proprietors (first_name, last_name),
          payments (status, created_at)
        `)
        .eq('state', state);

      if (schoolsError) throw schoolsError;

      const formattedSchools = (schoolsData || []).map(school => ({
        id: school.id,
        school_id: school.school_id,
        name: school.name,
        type: school.type || 'N/A',
        status: school.status,
        total_enrollment: school.total_enrollment || 0,
        proprietor_name: school.proprietors 
          ? `${school.proprietors.first_name} ${school.proprietors.last_name}`
          : 'N/A',
        payment_status: school.payments?.[0]?.status || 'pending',
        last_payment: school.payments?.[0]?.created_at || 'N/A',
      }));

      setSchools(formattedSchools);

      // Calculate summary
      const revenue = formattedSchools.length * 20500; // Simplified calculation
      setStateSummary({
        total_schools: formattedSchools.length,
        total_proprietors: new Set(formattedSchools.map(s => s.id)).size,
        total_revenue: revenue,
        completed_payments: formattedSchools.filter(s => s.payment_status === 'completed').length,
        pending_payments: formattedSchools.filter(s => s.payment_status === 'pending').length,
        active_schools: formattedSchools.filter(s => s.status === 'approved').length,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Building2 className="w-6 h-6" />
                State Chairman Portal
              </CardTitle>
              <CardDescription>Authorized access for State Chairmen only</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={loginForm.email}
                    onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <select 
                    id="state" 
                    className="w-full px-3 py-2 border rounded-md"
                    value={loginForm.state}
                    onChange={e => setLoginForm({...loginForm, state: e.target.value})}
                    required
                  >
                    <option value="">Select State</option>
                    {NORTH_CENTRAL_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={loginForm.password}
                    onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              {selectedState} State Dashboard
            </h1>
            <p className="text-slate-600 mt-2">State Chairman Portal</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['overview', 'schools', 'financial'] as const).map(tab => (
              <Button 
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'overview' && <BarChart3 className="w-4 h-4 mr-2" />}
                {tab === 'schools' && <School className="w-4 h-4 mr-2" />}
                {tab === 'financial' && <DollarSign className="w-4 h-4 mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && stateSummary && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Total Schools</p>
                        <p className="text-3xl font-bold">{stateSummary.total_schools}</p>
                      </div>
                      <Building2 className="w-8 h-8 text-emerald-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Active Schools</p>
                        <p className="text-3xl font-bold">{stateSummary.active_schools}</p>
                      </div>
                      <CheckCircle2 className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Total Revenue</p>
                        <p className="text-3xl font-bold">₦{stateSummary.total_revenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-sm text-emerald-600">Completed</p>
                      <p className="text-2xl font-bold text-emerald-700">{stateSummary.completed_payments}</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-700">{stateSummary.pending_payments}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Schools Tab */}
          {activeTab === 'schools' && (
            <Card>
              <CardHeader>
                <CardTitle>Schools in {selectedState}</CardTitle>
                <CardDescription>Monitor all registered schools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">School ID</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Proprietor</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-right p-2">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schools.map(school => (
                        <tr key={school.id} className="border-b hover:bg-slate-50">
                          <td className="p-2 font-mono text-xs">{school.school_id}</td>
                          <td className="p-2 font-medium">{school.name}</td>
                          <td className="p-2">{school.proprietor_name}</td>
                          <td className="p-2">{school.type}</td>
                          <td className="p-2">
                            <Badge variant={school.status === 'approved' ? 'default' : 'outline'}>
                              {school.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-right">
                            <Badge className={
                              school.payment_status === 'completed' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }>
                              {school.payment_status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Tab */}
          {activeTab === 'financial' && stateSummary && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary - {selectedState}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Revenue', amount: stateSummary.total_revenue },
                      { label: 'Completed Payments', amount: stateSummary.completed_payments, isCount: true },
                      { label: 'Pending Payments', amount: stateSummary.pending_payments, isCount: true },
                      { label: 'Total Schools', amount: stateSummary.total_schools, isCount: true },
                    ].map(({ label, amount, isCount }) => (
                      <div key={label} className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600">{label}</p>
                        <p className="text-2xl font-bold">
                          {isCount ? amount : `₦${amount.toLocaleString()}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
