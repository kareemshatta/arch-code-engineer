import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: keyof JSX.IntrinsicElements;
}

const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1800px]',
  full: 'max-w-none',
};

export function Container({
  children,
  className,
  size = 'xl',
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'w-full mx-auto px-6 md:px-12 lg:px-20',
        sizes[size],
        className
      )}
    >
      {children}
    </Component>
  );
}

export default Container;

