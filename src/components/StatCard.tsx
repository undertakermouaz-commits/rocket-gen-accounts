import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "glass-card p-5 group hover:glow-primary transition-all duration-300",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs px-2 py-1 rounded-full",
            trend === 'up' && "bg-emerald-500/10 text-emerald-400",
            trend === 'down' && "bg-red-500/10 text-red-400",
            trend === 'neutral' && "bg-muted text-muted-foreground"
          )}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trend === 'neutral' && '—'}
          </span>
        )}
      </div>
      <p className="font-display text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
