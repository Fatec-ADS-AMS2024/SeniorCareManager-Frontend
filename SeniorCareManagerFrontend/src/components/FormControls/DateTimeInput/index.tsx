import { InputHTMLAttributes } from 'react';
import { FormField } from '../FormField';
import { BaseFieldProps } from '../types';

interface DateTimeInputProps<T>
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'name'> {
  type?: 'date' | 'time';
  name: keyof T;
  onChange: (attribute: keyof T, value: string) => void;
}

export default function DateTimeInput<T>({
  label,
  error,
  required,
  type = 'date',
  value,
  icon,
  name,
  onChange,
  ...props
}: DateTimeInputProps<T>) {
  return (
    <FormField label={label} error={error} required={required}>
      {icon && (
        <span className='absolute top-2.5 left-2 text-xl text-textSecondary shrink-0'>
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        name={String(name)}
        onChange={(e) => onChange(e.target.name as keyof T, e.target.value)}
        className={`w-full py-2 text-sm text-textPrimary rounded border focus:outline-none focus:border-neutralDarker ${
          error ? 'border-danger' : 'border-neutralDark'
        } ${icon ? 'pr-2 pl-8' : 'px-2'}`}
        {...props}
      />
    </FormField>
  );
}
