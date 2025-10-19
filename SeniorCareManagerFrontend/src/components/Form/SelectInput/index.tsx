import { BaseFieldProps } from '../types';
import { FormField } from '../FormField';
import { SelectHTMLAttributes } from 'react';

interface SelectInputProps
  extends BaseFieldProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: { label: string; value: string | number }[];
  onChange: (value: string) => void;
}

export default function SelectInput({
  label,
  error,
  required,
  value,
  options,
  onChange,
  ...props
}: SelectInputProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full py-2 px-2 text-sm text-textPrimary rounded border border-neutral focus:outline-none focus:border-neutralDark'
        {...props}
      >
        <option value='' disabled selected>
          Selecione um...
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
