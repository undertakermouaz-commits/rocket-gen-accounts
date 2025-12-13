import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Rocket, Zap, Shield, Gift, ChevronRight, Sparkles, Users } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--glow-secondary)/0.1),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-glow-secondary/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="https://discord.gg/QWwqhxV7CA" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="https://discord.gg/QWwqhxV7CA" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Discord
              </Button>
            </a>
            <Link to="/auth">
              <Button variant="glow">
                Get Started
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="container mx-auto px-4 pt-24 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Free Premium Account Generator</span>
            </div>
            
            {/* Headline */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight animate-fade-in">
              Generate Premium
              <br />
              <span className="gradient-text">Accounts Instantly</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Access premium streaming services with our secure account generator. 
              Generate up to <span className="text-foreground font-semibold">10 accounts daily</span>, completely free.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link to="/auth">
                <Button variant="glow" size="xl" className="group">
                  <Rocket className="h-5 w-5 mr-2 group-hover:animate-rocket-launch" />
                  Start Generating Now
                  <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="https://discord.gg/QWwqhxV7CA" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-border/50 hover:border-border hover:bg-secondary/50">
                  <Users className="h-4 w-4 mr-2" />
                  Join Our Community
                </Button>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 mt-16 text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm">Online 24/7</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm">Instant Access</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container mx-auto px-4 pb-32">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to access premium services, all in one place.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { 
                icon: Rocket, 
                title: 'Instant Generation', 
                desc: 'Generate accounts in seconds with just one click. No waiting, no complicated steps.',
                gradient: 'from-primary/20 to-transparent'
              },
              { 
                icon: Shield, 
                title: 'Secure & Private', 
                desc: 'Your data is encrypted and never stored. Complete anonymity guaranteed.',
                gradient: 'from-emerald-500/20 to-transparent'
              },
              { 
                icon: Gift, 
                title: '10 Free Daily', 
                desc: 'Generous daily limit of 10 accounts. Reset every 24 hours, completely free.',
                gradient: 'from-glow-secondary/20 to-transparent'
              },
            ].map((feature, i) => (
              <div 
                key={feature.title} 
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-8 hover:border-primary/30 transition-all duration-500"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-card/50 to-glow-secondary/10 p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.1),transparent_70%)]" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of users already using our platform. Create your free account today.
              </p>
              <Link to="/auth">
                <Button variant="glow" size="xl">
                  <Rocket className="h-5 w-5 mr-2" />
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/30 py-8">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">© 2024 Rocket | gen. All rights reserved.</p>
            <a 
              href="https://discord.gg/QWwqhxV7CA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Join Discord
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
