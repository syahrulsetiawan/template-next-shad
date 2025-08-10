import * as React from 'react';
import {Input as ShadcnInput} from '@/components/ui/input';
import {Label as ShadcnLabel} from '@/components/ui/label';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  layout?: 'vertical' | 'horizontal';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  placeholder?: string;
}

const CustomInput: React.FC<
  InputProps & {type?: React.HTMLInputTypeAttribute}
> = ({
  label,
  required = false,
  error,
  layout = 'vertical',
  id,
  className = '',
  type = 'text',
  icon,
  iconPosition = 'left',
  placeholder,
  ...props
}) => {
  const inputId =
    id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div
      className={
        layout === 'horizontal'
          ? 'flex items-center gap-4 mb-2'
          : 'flex flex-col mb-2'
      }
    >
      {label && (
        <ShadcnLabel htmlFor={inputId} className="mb-1 flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </ShadcnLabel>
      )}
      <div className={layout === 'horizontal' ? 'flex-1' : ''}>
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </span>
          )}
          <ShadcnInput
            id={inputId}
            required={required}
            type={type}
            placeholder={placeholder}
            className={`${icon ? (iconPosition === 'left' ? 'pl-9' : 'pr-9') : ''} ${error ? 'border-red-500' : ''} ${className}`}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </span>
          )}
        </div>
        {error && (
          <div className="text-xs font-medium text-destructive mt-1">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
