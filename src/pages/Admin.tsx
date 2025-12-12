import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Lock, Plus, Trash2, Package, Users, Database } from 'lucide-react';

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
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <p className="text-muted-foreground mt-4">Admin Access</p>
          </div>
          
          <form onSubmit={handleLogin} className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-primary" />
              <span className="font-display font-bold">Enter Password</span>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
            />
            <Button type="submit" variant="glow" className="w-full">Access Panel</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Logo size="md" />
          <Button variant="outline" onClick={() => setAuthenticated(false)}>Logout</Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Services', value: stats.totalServices, icon: Package },
              { label: 'Total Accounts', value: stats.totalAccounts, icon: Database },
              { label: 'Available', value: stats.availableAccounts, icon: Database },
              { label: 'Users', value: stats.totalUsers, icon: Users },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4">
                <stat.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Add Service */}
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add Service
            </h2>
            <form onSubmit={handleAddService} className="space-y-4">
              <Input placeholder="Service name (e.g., Netflix)" value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} />
              <Input placeholder="Icon (emoji)" value={newServiceIcon} onChange={(e) => setNewServiceIcon(e.target.value)} />
              <Input placeholder="Description" value={newServiceDesc} onChange={(e) => setNewServiceDesc(e.target.value)} />
              <Button type="submit" variant="glow" className="w-full">Add Service</Button>
            </form>
          </div>

          {/* Add Account */}
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add Account
            </h2>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <select
                className="w-full h-11 rounded-lg border border-border bg-secondary/50 px-4 text-sm"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="">Select service</option>
                {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <Input placeholder="Email" value={accountEmail} onChange={(e) => setAccountEmail(e.target.value)} />
              <Input placeholder="Password" value={accountPassword} onChange={(e) => setAccountPassword(e.target.value)} />
              <Button type="submit" variant="glow" className="w-full">Add Account</Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Bulk add (email:password per line)</p>
              <textarea
                className="w-full h-24 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm"
                placeholder="email1@test.com:password1&#10;email2@test.com:password2"
                value={bulkAccounts}
                onChange={(e) => setBulkAccounts(e.target.value)}
              />
              <Button variant="outline" className="w-full mt-2" onClick={handleBulkAdd}>Bulk Add</Button>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="mt-8">
          <h2 className="font-display font-bold text-lg mb-4">Services</h2>
          <div className="grid gap-4">
            {services.map((service) => (
              <div key={service.id} className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{service.icon || '🎯'}</span>
                  <div>
                    <p className="font-bold">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.accounts?.[0]?.count || 0} accounts
                    </p>
                  </div>
                </div>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteService(service.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
