import { cn } from '@/lib/utils';

interface ServiceIconProps {
  icon: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconMap: Record<string, string> = {
  netflix: '🎬',
  spotify: '🎵',
  disney: '🏰',
  hbo: '📺',
  amazon: '📦',
  prime: '📦',
  youtube: '▶️',
  apple: '🍎',
  hulu: '📺',
  default: '🎯'
};

const sizeClasses = {
  sm: 'w-8 h-8 text-xl',
  md: 'w-12 h-12 text-3xl',
  lg: 'w-16 h-16 text-5xl'
};

export function ServiceIcon({ icon, name, size = 'md', className }: ServiceIconProps) {
  const isUrl = icon?.startsWith('http');
  
  const getEmoji = () => {
    if (icon && !isUrl) return icon;
    const lowerName = name.toLowerCase();
    for (const [key, emoji] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) return emoji;
    }
    return iconMap.default;
  };

  if (isUrl) {
    return (
      <div className={cn(
        "rounded-xl overflow-hidden bg-secondary/50 flex items-center justify-center",
        sizeClasses[size],
        className
      )}>
        <img 
          src={icon!} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center justify-center",
      sizeClasses[size],
      className
    )}>
      <span>{getEmoji()}</span>
    </div>
  );
}
