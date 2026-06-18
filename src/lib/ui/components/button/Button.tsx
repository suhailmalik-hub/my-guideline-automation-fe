import type { LucideIcon } from 'lucide-react';
import React from 'react';
import { ButtonLoader } from '../loader/ButtonLoader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'text';
  isLoading?: boolean;
  loaderSize?: number;
  loaderColor?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  iconSize?: number;
  buttonColor?: string;
  textColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  loaderSize = 20,
  loaderColor = '#FFFFFF',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  iconSize = 16,
  textColor,
  buttonColor,
  className = '',
  ...props
}) => {
  const baseClasses =
    'flex justify-center items-center rounded-sm font-medium focus:outline-none transition-colors disabled:cursor-not-allowed cursor-pointer relative';

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50',
    text: 'text-blue-500 bg-transparent disabled:text-gray-400',
  };

  const sizeClasses = LeftIcon || RightIcon ? 'text-sm h-10 py-2 px-4 gap-2' : 'text-sm h-10 py-2 px-4';

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${className}`;

  const isIconDimmed = variant === 'text' && (disabled || isLoading);
  const iconClass = isIconDimmed ? 'opacity-50' : '';

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      style={{
        ...(buttonColor && variant === 'primary' ? { backgroundColor: buttonColor } : {}),
        ...(textColor ? { color: textColor } : {}),
      }}
      {...props}
    >
      <div
        className={`flex items-center justify-center ${isLoading ? 'invisible' : ''} ${LeftIcon || RightIcon ? 'gap-2' : ''}`}
      >
        {LeftIcon && (
          <LeftIcon
            size={iconSize}
            className={iconClass}
          />
        )}
        {children}
        {RightIcon && (
          <RightIcon
            size={iconSize}
            className={iconClass}
          />
        )}
      </div>

      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <ButtonLoader
            size={loaderSize}
            color={loaderColor}
          />
        </div>
      )}
    </button>
  );
};
