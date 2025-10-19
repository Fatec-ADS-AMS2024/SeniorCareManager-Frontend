import { FormField } from '../FormField';
import { BaseFieldProps } from '../types';
import Checkbox from '../Checkbox';

interface CheckboxOption {
  value: unknown;
  label: string;
  disabled?: boolean;
}

interface CheckboxGroupProps extends BaseFieldProps {
  options: CheckboxOption[];
  values: unknown[];
  onChange: (values: unknown[]) => void;
}

/**
 * Um grupo de checkboxes para múltiplas seleções
 */
export default function CheckboxGroup({
  label,
  error,
  required,
  options,
  values,
  onChange,
}: CheckboxGroupProps) {
  const handleChange = (optionValue: unknown, checked: boolean) => {
    if (checked) {
      onChange([...values, optionValue]);
    } else {
      onChange(values.filter((value) => value !== optionValue));
    }
  };

  return (
    <FormField label={label} error={error} required={required}>
      <div className={`space-y-2 ${label && 'px-2'}`}>
        {options.map((option) => (
          <Checkbox
            key={`Option_${option.value}`}
            label={option.label}
            checked={values.includes(option.value)}
            onChange={(checked) => handleChange(option.value, checked)}
            disabled={option.disabled}
          />
        ))}
      </div>
    </FormField>
  );
}
