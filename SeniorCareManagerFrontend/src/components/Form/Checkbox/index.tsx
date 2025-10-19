import { InputHTMLAttributes } from 'react';
import { FormField } from '../FormField';
import { BaseFieldProps } from '../types';

interface CheckboxProps
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Um checkbox para seleção única
 */
export default function Checkbox({
  label,
  error,
  required,
  checked,
  onChange,
  ...props
}: CheckboxProps) {
  return (
    <FormField error={error} required={required}>
      <label className='flex items-center cursor-pointer'>
        <input
          type='checkbox'
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={`w-4 h-4 text-textPrimary rounded border focus:ring-2 focus:ring-neutralDark ${
            error ? 'border-danger' : 'border-neutral'
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
