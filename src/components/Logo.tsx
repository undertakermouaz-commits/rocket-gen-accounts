import logo from '@/assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-3">
      <img 
        src={logo} 
        alt="Rocket Gen Logo" 
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <h1 className={`font-display font-bold ${textSizeClasses[size]} gradient-text`}>
          Rocket<span className="text-foreground"> | </span>gen
        </h1>
      )}
    </div>
  );
}
