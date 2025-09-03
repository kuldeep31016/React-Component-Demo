import React from 'react';
import clsx from 'clsx';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses =
    'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-4';

  const variantClasses = {
    primary:
      'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-200',
    secondary:
      'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-200',
    outline:
      'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-200',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
