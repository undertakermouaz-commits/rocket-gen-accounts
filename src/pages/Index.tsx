import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Rocket, Zap, Shield, Gift } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <a href="https://discord.gg/QWwqhxV7CA" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discord
            </Button>
          </a>
          <Link to="/auth">
            <Button variant="glow">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm">Free account generator</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Generate Premium
            <br />
            <span className="gradient-text">Accounts Instantly</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Get access to premium streaming services with our free account generator. 
            Up to 10 accounts per day, completely free.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button variant="glow" size="xl">
                <Rocket className="h-5 w-5 mr-2" />
                Start Generating
              </Button>
            </Link>
            <a href="https://discord.gg/QWwqhxV7CA" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">Join Discord</Button>
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto">
          {[
            { icon: Rocket, title: 'Instant Generation', desc: 'Get accounts in seconds with one click' },
            { icon: Shield, title: 'Secure & Private', desc: 'Your data is never stored or shared' },
            { icon: Gift, title: '10 Free Daily', desc: 'Generate up to 10 accounts every day' },
          ].map((feature) => (
            <div key={feature.title} className="glass-card p-6 text-center group hover:glow-primary transition-all duration-300">
              <feature.icon className="h-10 w-10 text-primary mx-auto mb-4 group-hover:animate-rocket-launch" />
              <h3 className="font-display font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
