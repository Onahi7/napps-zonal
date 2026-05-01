import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, Building2, Users, DollarSign, TrendingUp, MapPin, 
  CheckCircle2, AlertCircle, Loader2, Download, Eye 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NORTH_CENTRAL_STATES } from "@/constants/north-central-config";

interface StateSummary {
  name: string;
  is_active: boolean;
  total_schools: number;
  total_proprietors: number;
  total_revenue: number;
  completed_payments: number;
  pending_payments: number;
}

interface ZonalSummary {
  total_schools: number;
  total_proprietors: number;
  total_revenue: number;
  local_dues: number;
  state_dues: number;
  zonal_dues: number;
  national_dues: number;
  completed_payments: number;
}

export default function ZonalPresidentDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [statesData, setStatesData] = useState<StateSummary[]>([]);
  const [zonalSummary, setZonalSummary] = useState<ZonalSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'states' | 'financial'>('overview');

  useEffect(() => {
    const token = localStorage.getItem('zonal_admin_token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', token)
        .eq('role', 'zonal_president')
        .single();
      
      if (data) {
        setIsAuthenticated(true);
        fetchData();
      }
    } catch (error) {
      console.error('Token verification failed');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In production, use proper authentication
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', loginForm.email)
        .single();

      if (error || !data) {
        throw new Error('Invalid credentials');
      }

      // Simple password check (in production, use proper hashing)
      if (data.password_hash !== loginForm.password) {
        throw new Error('Invalid credentials');
      }

      localStorage.setItem('zonal_admin_token', loginForm.email);
      setIsAuthenticated(true);
      fetchData();
      toast.success('Welcome, Zonal President!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch financial summary from view
      const { data: financialData, error: financialError } = await supabase
        .from('financial_summary')
        .select('*');

      if (financialError) throw financialError;

      // Fetch zonal summary
      const { data: zonalData, error: zonalError } = await supabase
        .from('zonal_financial_summary')
        .select('*')
        .single();

      if (zonalError && zonalError.code !== 'PGRST116') throw zonalError;

      setStatesData(financialData || []);
      if (zonalData) {
        setZonalSummary({
          total_schools: zonalData.total_schools || 0,
          total_proprietors: zonalData.total_proprietors || 0,
          total_revenue: parseFloat(zonalData.total_revenue) || 0,
          local_dues: parseFloat(zonalData.local_dues) || 0,
          state_dues: parseFloat(zonalData.state_dues) || 0,
          zonal_dues: parseFloat(zonalData.zonal_dues) || 0,
          national_dues: parseFloat(zonalData.national_dues) || 0,
          completed_payments: zonalData.completed_payments || 0,
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateState = async (stateName: string) => {
    try {
      const { error } = await supabase
        .from('states')
        .update({ 
          is_active: true, 
          activated_at: new Date().toISOString() 
        })
        .eq('name', stateName);

      if (error) throw error;

      toast.success(`${stateName} state activated!`);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to activate state');
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Zonal President Portal
              </CardTitle>
              <CardDescription>Authorized access only</CardDescription>
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
            <h1 className="text-3xl font-bold text-slate-900">Zonal President Dashboard</h1>
            <p className="text-slate-600 mt-2">North Central Zone Overview</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['overview', 'states', 'financial'] as const).map(tab => (
              <Button 
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'overview' && <BarChart3 className="w-4 h-4 mr-2" />}
                {tab === 'states' && <MapPin className="w-4 h-4 mr-2" />}
                {tab === 'financial' && <DollarSign className="w-4 h-4 mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && zonalSummary && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Total Schools</p>
                        <p className="text-3xl font-bold">{zonalSummary.total_schools}</p>
                      </div>
                      <Building2 className="w-8 h-8 text-emerald-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Total Proprietors</p>
                        <p className="text-3xl font-bold">{zonalSummary.total_proprietors}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Total Revenue</p>
                        <p className="text-3xl font-bold">₦{zonalSummary.total_revenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Payments</p>
                        <p className="text-3xl font-bold">{zonalSummary.completed_payments}</p>
                      </div>
                      <CheckCircle2 className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Local Dues', amount: zonalSummary.local_dues },
                      { label: 'State Dues', amount: zonalSummary.state_dues },
                      { label: 'Zonal Dues', amount: zonalSummary.zonal_dues },
                      { label: 'National Dues', amount: zonalSummary.national_dues },
                    ].map(({ label, amount }) => (
                      <div key={label} className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600">{label}</p>
                        <p className="text-xl font-bold">₦{amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* States Tab */}
          {activeTab === 'states' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">State-wise Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statesData.map(state => (
                  <Card key={state.name} className={state.is_active ? 'border-emerald-200' : 'border-slate-200'}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">{state.name}</h3>
                        {state.is_active ? (
                          <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Schools:</span>
                          <span className="font-medium">{state.total_schools}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Revenue:</span>
                          <span className="font-medium">₦{state.total_revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Payments:</span>
                          <span className="font-medium">{state.completed_payments}</span>
                        </div>
                      </div>
                      {!state.is_active && (
                        <Button 
                          size="sm" 
                          className="w-full mt-4"
                          onClick={() => handleActivateState(state.name)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Activate State
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Financial Tab */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Performance by State</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">State</th>
                          <th className="text-right p-2">Schools</th>
                          <th className="text-right p-2">Revenue</th>
                          <th className="text-right p-2">Local</th>
                          <th className="text-right p-2">State</th>
                          <th className="text-right p-2">Zonal</th>
                          <th className="text-right p-2">National</th>
                          <th className="text-right p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statesData.map(state => (
                          <tr key={state.name} className="border-b hover:bg-slate-50">
                            <td className="p-2 font-medium">{state.name}</td>
                            <td className="p-2 text-right">{state.total_schools}</td>
                            <td className="p-2 text-right">₦{state.total_revenue.toLocaleString()}</td>
                            <td className="p-2 text-right">-</td>
                            <td className="p-2 text-right">-</td>
                            <td className="p-2 text-right">-</td>
                            <td className="p-2 text-right">-</td>
                            <td className="p-2 text-right">
                              {state.is_active ? (
                                <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                              ) : (
                                <Badge variant="outline">Inactive</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
