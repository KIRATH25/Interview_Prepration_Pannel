import React from 'react';

type LordIconProps = {
  src: string;
  trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'boomerang';
  colors?: {
    primary?: string;
    secondary?: string;
  };
  size?: number;
  className?: string;
  delay?: number;
};

export const LordIcon = ({
  src,
  trigger = 'hover',
  colors = { primary: '#a1a1aa', secondary: '#a1a1aa' },
  size = 24,
  className,
  delay
}: LordIconProps) => {
  const colorString = `primary:${colors.primary},secondary:${colors.secondary}`;

  return (
    <div className={className} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* @ts-ignore */}
      <lord-icon
        src={src}
        trigger={trigger}
        colors={colorString}
        style={{ width: '100%', height: '100%' }}
        delay={delay}
      />
    </div>
  );
};
