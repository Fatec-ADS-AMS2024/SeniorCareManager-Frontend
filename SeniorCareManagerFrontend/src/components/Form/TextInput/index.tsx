import { InputHTMLAttributes } from 'react';
import { FormField } from '../FormField';
import { BaseFieldProps } from '../types';

interface TextInputProps
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  type?: 'text' | 'email' | 'number';
  onChange: (value: string) => void;
}

/**
 * Um input comum que suporta texto, email e números
 */
export default function TextInput({
  label,
  error,
  required,
  type = 'text',
  value,
  onChange,
  ...props
}: TextInputProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full py-2 px-2 text-sm text-textPrimary rounded border border-neutral focus:outline-none focus:border-neutralDark'
        {...props}
      />
    </FormField>
  );
}
