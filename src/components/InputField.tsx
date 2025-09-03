import React, { useState, forwardRef, useId } from 'react';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export interface InputFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;

  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;

  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  required?: boolean;
  readOnly?: boolean;

  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';

  showClearButton?: boolean;
  showPasswordToggle?: boolean;

  id?: string;
  name?: string;
  className?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      label,
      placeholder,
      helperText,
      errorMessage,
      disabled = false,
      invalid = false,
      loading = false,
      required = false,
      readOnly = false,
      variant = 'outlined',
      size = 'md',
      type = 'text',
      showClearButton = false,
      showPasswordToggle = false,
      id: propId,
      name,
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || '');

    const generatedId = useId();
    const inputId = propId || generatedId;

    // Determine if this is a controlled or uncontrolled component
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const isPasswordType = type === 'password';
    const displayType = isPasswordType && showPassword ? 'text' : type;
    const hasValue = currentValue !== '';
    const hasError = invalid || errorMessage;

    // Size classes
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-4 text-lg',
    };

    // Variant classes
    const variantClasses = {
      filled: clsx(
        'bg-secondary-50 border-transparent',
        'focus:bg-white focus:border-primary-500',
        'hover:bg-secondary-100'
      ),
      outlined: clsx(
        'bg-transparent border-secondary-300',
        'focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
        'hover:border-secondary-400'
      ),
      ghost: clsx(
        'bg-transparent border-transparent',
        'focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
        'hover:bg-secondary-50'
      ),
    };

    // Label size classes
    const labelSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    // Helper text size classes
    const helperSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      const syntheticEvent = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;

      if (!isControlled) {
        setInternalValue('');
      }
      onChange?.(syntheticEvent);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={clsx('relative', className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              'mb-1 block font-medium text-secondary-700',
              labelSizeClasses[size],
              hasError && 'text-error-600',
              disabled && 'text-secondary-400'
            )}
          >
            {label}
            {required && <span className="ml-1 text-error-500">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={displayType}
            value={isControlled ? value : undefined}
            defaultValue={!isControlled ? defaultValue : undefined}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled || loading}
            readOnly={readOnly}
            required={required}
            className={clsx(
              'w-full rounded-lg border transition-all duration-200',
              'placeholder:text-secondary-400',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'read-only:cursor-default read-only:bg-secondary-50',
              sizeClasses[size],
              variantClasses[variant],
              hasError && [
                'border-error-500',
                'focus:border-error-500 focus:ring-error-200',
              ],
              !hasError && isFocused && 'border-primary-500',
              !hasError && !isFocused && 'border-secondary-300',
              // Padding adjustments for icons
              (showClearButton || showPasswordToggle || loading) && 'pr-12',
              showClearButton && showPasswordToggle && 'pr-20'
            )}
            {...props}
          />

          {/* Loading Spinner */}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2
                className="h-4 w-4 animate-spin text-secondary-400"
                role="status"
              />
            </div>
          )}

          {/* Clear Button */}
          {showClearButton && hasValue && !loading && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              aria-label="Clear input"
              className={clsx(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'rounded-full p-1 hover:bg-secondary-100',
                'transition-colors duration-200',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              <X className="h-4 w-4 text-secondary-400 hover:text-secondary-600" />
            </button>
          )}

          {/* Password Toggle */}
          {showPasswordToggle && isPasswordType && !loading && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={disabled}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className={clsx(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'rounded-full p-1 hover:bg-secondary-100',
                'transition-colors duration-200',
                'disabled:cursor-not-allowed disabled:opacity-50',
                showClearButton && 'right-11'
              )}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-secondary-400 hover:text-secondary-600" />
              ) : (
                <Eye className="h-4 w-4 text-secondary-400 hover:text-secondary-600" />
              )}
            </button>
          )}
        </div>

        {/* Helper Text or Error Message */}
        {(helperText || errorMessage) && (
          <div
            className={clsx(
              'mt-1',
              helperSizeClasses[size],
              errorMessage ? 'text-error-600' : 'text-secondary-500'
            )}
          >
            {errorMessage || helperText}
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
