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
  icon,
  ...props
}: SelectInputProps) {
  return (
    <FormField label={label} error={error} required={required}>
      {icon && (
        <span className='absolute top-2.5 left-2 text-xl text-textSecondary shrink-0'>
          {icon}
        </span>
      )}
      <select
        value={value}
        defaultValue={''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full py-2 text-sm text-textPrimary rounded border focus:outline-none focus:border-neutralDark ${
          error ? 'border-danger' : 'border-neutral'
        } ${icon ? 'pr-2 pl-7' : 'px-1'}`}
        {...props}
      >
        <option value='' disabled>
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
