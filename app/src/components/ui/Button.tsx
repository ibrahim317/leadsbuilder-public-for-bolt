import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'default',
  size = 'default',
  ...props
}, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600': variant === 'default',
          'border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-400': variant === 'outline',
          'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400': variant === 'ghost',
          'text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-600': variant === 'link',
          'h-10 px-4 py-2': size === 'default',
          'h-8 px-3 text-sm': size === 'sm',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button };
