import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ServiceIcon } from '@/components/ServiceIcon';
import { StatCard } from '@/components/StatCard';
import { toast } from 'sonner';
import { Lock, Plus, Trash2, Package, Users, Database, Shield, RefreshCw, Upload, Settings } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  accounts: { count: number }[];
}

interface Stats {
  totalServices: number;
  totalAccounts: number;
  availableAccounts: number;
  totalUsers: number;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'accounts'>('services');
  
  // Form states
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceIcon, setNewServiceIcon] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [bulkAccounts, setBulkAccounts] = useState('');

  const adminPassword = '0000advin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setAuthenticated(true);
      toast.success('Admin access granted');
      fetchData();
    } else {
      toast.error('Invalid password');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesRes, statsRes] = await Promise.all([
        supabase.functions.invoke('admin-operations', {
          body: { action: 'get_services', password: adminPassword }
        }),
        supabase.functions.invoke('admin-operations', {
          body: { action: 'get_stats', password: adminPassword }
        })
      ]);

      if (servicesRes.data?.services) setServices(servicesRes.data.services);
      if (statsRes.data?.stats) setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;

    try {
      const { data, error } = await supabase.functions.invoke('admin-operations', {
        body: {
          action: 'add_service',
          password: adminPassword,
          data: { name: newServiceName, icon: newServiceIcon, description: newServiceDesc }
        }
      });

      if (data?.success) {
        toast.success('Service added!');
        setNewServiceName('');
        setNewServiceIcon('');
        setNewServiceDesc('');
        fetchData();
      } else {
        toast.error(data?.error || 'Failed to add service');
      }
    } catch (error) {
      toast.error('Error adding service');
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !accountEmail || !accountPassword) return;

    try {
      const { data } = await supabase.functions.invoke('admin-operations', {
        body: {
          action: 'add_account',
          password: adminPassword,
          data: { service_id: selectedService, email: accountEmail, accountPassword: accountPassword }
        }
      });

      if (data?.success) {
        toast.success('Account added!');
        setAccountEmail('');
        setAccountPassword('');
        fetchData();
      } else {
        toast.error(data?.error || 'Failed to add account');
      }
    } catch (error) {
      toast.error('Error adding account');
    }
  };

  const handleBulkAdd = async () => {
    if (!selectedService || !bulkAccounts) return;

    const lines = bulkAccounts.split('\n').filter(l => l.trim());
    const accounts = lines.map(line => {
      const [email, pass] = line.split(':').map(s => s.trim());
      return { email, password: pass };
    }).filter(a => a.email && a.password);

    if (accounts.length === 0) {
      toast.error('No valid accounts found. Use format: email:password');
      return;
    }

    try {
      const { data } = await supabase.functions.invoke('admin-operations', {
        body: {
          action: 'bulk_add_accounts',
          password: adminPassword,
          data: { service_id: selectedService, accounts }
        }
      });

      if (data?.success) {
        toast.success(`Added ${data.count} accounts!`);
        setBulkAccounts('');
        fetchData();
      }
    } catch (error) {
      toast.error('Error adding accounts');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Delete this service and all its accounts?')) return;

    try {
      const { data } = await supabase.functions.invoke('admin-operations', {
        body: { action: 'delete_service', password: adminPassword, data: { service_id: serviceId } }
      });

      if (data?.success) {
        toast.success('Service deleted');
        fetchData();
      }
    } catch (error) {
      toast.error('Error deleting service');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1),transparent_70%)]" />
        </div>
        
        <div className="w-full max-w-sm relative z-10">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
              <Shield className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Admin Access</span>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="glass-card p-8 rounded-2xl border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">Authentication Required</h2>
                <p className="text-sm text-muted-foreground">Enter admin password to continue</p>
              </div>
            </div>
            
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="h-12 mb-4"
            />
            <Button type="submit" variant="glow" className="w-full h-11">
              Access Panel
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.05),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10">
              <Settings className="h-3 w-3 text-destructive" />
              <span className="text-xs font-medium text-destructive">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAuthenticated(false)}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Services" value={stats.totalServices} icon={Package} />
            <StatCard label="Total Accounts" value={stats.totalAccounts} icon={Database} />
            <StatCard label="Available" value={stats.availableAccounts} icon={Database} trend="neutral" />
            <StatCard label="Registered Users" value={stats.totalUsers} icon={Users} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'services' ? 'glow' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('services')}
          >
            <Package className="h-4 w-4 mr-2" />
            Services
          </Button>
          <Button
            variant={activeTab === 'accounts' ? 'glow' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('accounts')}
          >
            <Database className="h-4 w-4 mr-2" />
            Add Accounts
          </Button>
        </div>

        {activeTab === 'services' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Add Service Form */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 rounded-2xl border border-border/50 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-display font-bold text-lg">Add Service</h2>
                </div>
                
                <form onSubmit={handleAddService} className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Service Name</label>
                    <Input 
                      placeholder="e.g., Netflix" 
                      value={newServiceName} 
                      onChange={(e) => setNewServiceName(e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Icon (emoji or URL)</label>
                    <Input 
                      placeholder="🎬 or https://..." 
                      value={newServiceIcon} 
                      onChange={(e) => setNewServiceIcon(e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
                    <Input 
                      placeholder="Optional description" 
                      value={newServiceDesc} 
                      onChange={(e) => setNewServiceDesc(e.target.value)} 
                    />
                  </div>
                  
                  <Button type="submit" variant="glow" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </form>
              </div>
            </div>

            {/* Services List */}
            <div className="lg:col-span-2">
              <h3 className="font-display font-bold text-lg mb-4">All Services ({services.length})</h3>
              <div className="space-y-3">
                {services.map((service) => (
                  <div 
                    key={service.id} 
                    className="glass-card p-4 rounded-xl border border-border/50 flex items-center justify-between group hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <ServiceIcon icon={service.icon} name={service.name} size="sm" />
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.accounts?.[0]?.count || 0} accounts available
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {services.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No services added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Single Account */}
            <div className="glass-card p-6 rounded-2xl border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display font-bold text-lg">Add Single Account</h2>
              </div>
              
              <form onSubmit={handleAddAccount} className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Select Service</label>
                  <select
                    className="w-full h-11 rounded-xl border border-border bg-secondary/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">Choose a service...</option>
                    {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                  <Input 
                    placeholder="account@email.com" 
                    value={accountEmail} 
                    onChange={(e) => setAccountEmail(e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
                  <Input 
                    placeholder="Account password" 
                    value={accountPassword} 
                    onChange={(e) => setAccountPassword(e.target.value)} 
                  />
                </div>
                
                <Button type="submit" variant="glow" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </form>
            </div>

            {/* Bulk Add */}
            <div className="glass-card p-6 rounded-2xl border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-glow-secondary/10">
                  <Upload className="h-5 w-5 text-glow-secondary" />
                </div>
                <h2 className="font-display font-bold text-lg">Bulk Import</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Select Service</label>
                  <select
                    className="w-full h-11 rounded-xl border border-border bg-secondary/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">Choose a service...</option>
                    {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">
                    Accounts (one per line, format: email:password)
                  </label>
                  <textarea
                    className="w-full h-40 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="email1@example.com:password1&#10;email2@example.com:password2&#10;email3@example.com:password3"
                    value={bulkAccounts}
                    onChange={(e) => setBulkAccounts(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" className="w-full" onClick={handleBulkAdd}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Accounts
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
