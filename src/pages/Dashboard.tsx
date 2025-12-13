import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ServiceIcon } from '@/components/ServiceIcon';
import { toast } from 'sonner';
import { LogOut, Rocket, Copy, Check, Zap, Gift, Clock, X, Sparkles } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
}

interface GeneratedAccount {
  email: string;
  password: string;
  serviceName: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [generatedAccount, setGeneratedAccount] = useState<GeneratedAccount | null>(null);
  const [remaining, setRemaining] = useState<number>(10);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchServices();
    fetchRemainingGenerations();
  }, [user, navigate]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRemainingGenerations = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('accounts_generated_today, last_generation_date')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (data) {
        const today = new Date().toISOString().split('T')[0];
        if (data.last_generation_date !== today) {
          setRemaining(10);
        } else {
          setRemaining(10 - (data.accounts_generated_today || 0));
        }
      }
    } catch (error) {
      console.error('Error fetching remaining:', error);
    }
  };

  const handleGenerate = async (serviceId: string, serviceName: string) => {
    if (remaining <= 0) {
      toast.error('Daily limit reached! Try again tomorrow.');
      return;
    }

    setGenerating(serviceId);
    setGeneratedAccount(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-account', {
        body: { service_id: serviceId },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.message || data.error);
        return;
      }

      setGeneratedAccount({
        email: data.account.email,
        password: data.account.password,
        serviceName
      });
      setRemaining(data.remaining);
      toast.success('Account generated successfully!');
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error('Failed to generate account. Please try again.');
    } finally {
      setGenerating(null);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Rocket className="h-12 w-12 text-primary animate-rocket-launch mx-auto mb-4" />
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          
          <div className="flex items-center gap-3">
            {/* Remaining counter */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
              <Gift className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                <span className="text-primary">{remaining}</span>
                <span className="text-muted-foreground">/10</span>
              </span>
            </div>
            
            <a 
              href="https://discord.gg/QWwqhxV7CA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:block"
            >
              <Button variant="ghost" size="sm">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </Button>
            </a>
            
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Dashboard</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Welcome, <span className="gradient-text">{user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-muted-foreground">
            Select a service below to generate an account.
          </p>
        </div>

        {/* Generated Account Display */}
        {generatedAccount && (
          <div className="mb-10 animate-fade-in">
            <div className="relative max-w-lg mx-auto glass-card p-6 rounded-2xl border border-primary/30 glow-primary">
              <button 
                onClick={() => setGeneratedAccount(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">Account Generated!</h3>
                  <p className="text-sm text-muted-foreground">{generatedAccount.serviceName}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="font-mono text-sm truncate">{generatedAccount.email}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="ml-3 shrink-0"
                    onClick={() => handleCopy(generatedAccount.email, 'email')}
                  >
                    {copiedField === 'email' ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Password</p>
                    <p className="font-mono text-sm truncate">{generatedAccount.password}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="ml-3 shrink-0"
                    onClick={() => handleCopy(generatedAccount.password, 'password')}
                  >
                    {copiedField === 'password' ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => {
                  handleCopy(`${generatedAccount.email}:${generatedAccount.password}`, 'both');
                }}
              >
                {copiedField === 'both' ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-emerald-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Both
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">No Services Available</h3>
            <p className="text-muted-foreground mb-6">
              Check back later for available services.
            </p>
            <a href="https://discord.gg/QWwqhxV7CA" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">Join Discord for Updates</Button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/30 transition-all duration-300"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">
                    <ServiceIcon icon={service.icon} name={service.name} size="md" />
                  </div>
                  
                  <h3 className="font-display font-bold text-lg mb-1">{service.name}</h3>
                  
                  {service.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
                  )}
                  
                  <Button
                    variant={remaining <= 0 ? 'outline' : 'glow'}
                    className="w-full"
                    onClick={() => handleGenerate(service.id, service.name)}
                    disabled={generating === service.id || remaining <= 0}
                  >
                    {generating === service.id ? (
                      <>
                        <Rocket className="h-4 w-4 mr-2 animate-rocket-launch" />
                        Generating...
                      </>
                    ) : remaining <= 0 ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Limit Reached
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
