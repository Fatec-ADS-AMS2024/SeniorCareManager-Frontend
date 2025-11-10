import { InputHTMLAttributes } from 'react';
import { FormField } from '../FormField';
import { BaseFieldProps } from '../types';

interface CheckboxProps<T>
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'name'> {
  checked: boolean;
  onChange: (attribute: keyof T, checked: boolean) => void;
  name: keyof T;
}

export default function Checkbox<T>({
  label,
  error,
  required,
  checked,
  name,
  onChange,
  id,
  ...props
}: CheckboxProps<T>) {
  const inputId = id || `checkbox-${String(name)}`;

  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <FormField error={error} required={required} id={inputId}>
      <label className='flex items-center cursor-pointer' htmlFor={inputId}>
        <input
          aria-required={required}
          type='checkbox'
          id={inputId}
          checked={checked}
          name={String(name)}
          onChange={(e) => onChange(e.target.name as keyof T, e.target.checked)}
          aria-invalid={!!error}
          {...(errorId && { 'aria-describedby': errorId })}
          className={`w-4 h-4 text-textPrimary rounded border focus:ring-2 focus:ring-neutralDarker ${
            error ? 'border-danger' : 'border-neutralDark'
          }`}
          {...props}
        />
        {label && (
          <span className='ml-2 text-sm text-textPrimary'>{label}</span>
        )}
      </label>
    </FormField>
  );
}
