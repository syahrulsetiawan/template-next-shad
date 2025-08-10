import * as React from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';
import { Label as ShadcnLabel } from '@/components/ui/label';

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'prefix' | 'suffix'
>;

export interface InputProps extends NativeInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  layout?: 'vertical' | 'horizontal';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  placeholder?: string;
  formatNumber?: (value: string | number) => string;
  decimal?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
  locale?: string;
  helperText?: string;
}

const CustomInputNumber: React.FC<
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
  formatNumber,
  decimal = 0,
  prefix,
  suffix,
  min,
  max,
  step = 1,
  locale,
  helperText,
  disabled,
  readOnly,
  value,
  onChange,
  ...props
}) => {
  const inputId =
    id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  // handle raw value for editing, and formatted value for display
  const [internalValue, setInternalValue] = React.useState(value ?? '');
  React.useEffect(() => {
    setInternalValue(value ?? '');
  }, [value]);
  // Only allow numeric input (with optional decimal point)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Allow negative, decimal, and only numbers
    val = val.replace(/[^\d.,-]/g, '');
    // Only one decimal point
    val = val.replace(/(\..*)\./g, '$1');
    setInternalValue(val);
    if (onChange) {
      // Patch event to have cleaned value
      const event = {...e, target: {...e.target, value: val}};
      onChange(event as React.ChangeEvent<HTMLInputElement>);
    }
  };
  // Format for display
  let displayValue: string | number = '';
  let rawValue = internalValue;
  if (typeof internalValue === 'string' || typeof internalValue === 'number') {
    if (formatNumber) {
      displayValue = formatNumber(internalValue);
    } else if (internalValue !== '' && !isNaN(Number(internalValue))) {
      displayValue = Number(internalValue).toLocaleString(locale, {
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal
      });
    } else {
      displayValue = internalValue;
    }
  } else if (Array.isArray(internalValue) && internalValue.length > 0) {
    if (formatNumber) {
      displayValue = formatNumber(internalValue[0]);
    } else if (internalValue[0] !== '' && !isNaN(Number(internalValue[0]))) {
      displayValue = Number(internalValue[0]).toLocaleString(locale, {
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal
      });
    } else {
      displayValue = internalValue[0];
    }
  }
  // On blur, auto-format
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (internalValue !== '' && !isNaN(Number(internalValue))) {
      setInternalValue(Number(internalValue).toFixed(decimal));
    }
    if (props.onBlur) props.onBlur(e);
  };
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
          <div className="flex items-center">
            {prefix && (
              <span className="mr-2 text-muted-foreground">{prefix}</span>
            )}
            <ShadcnInput
              id={inputId}
              required={required}
              type="text"
              placeholder={placeholder}
              className={`${icon ? (iconPosition === 'left' ? 'pl-9' : 'pr-9') : ''} ${error ? 'border-red-500' : ''} ${className}`}
              value={displayValue}
              onChange={handleChange}
              onBlur={handleBlur}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              readOnly={readOnly}
              inputMode="decimal"
              {...props}
            />
            {suffix && (
              <span className="ml-2 text-muted-foreground">{suffix}</span>
            )}
          </div>
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
        {helperText && !error && (
          <div className="text-xs text-muted-foreground mt-1">{helperText}</div>
        )}
      </div>
    </div>
  );
};

export default CustomInputNumber;
