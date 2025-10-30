import { BaseFieldProps } from '../types';
import { FormField } from '../FormField';
import { SelectHTMLAttributes } from 'react';
import { useId } from 'react';

interface SelectInputProps<T>
  extends BaseFieldProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'name'> {
  options: { label: string; value: string | number }[];
  onChange: (attribute: keyof T, value: string) => void;
  name: keyof T;
  // Adiciona 'id' para que o FormField possa associar corretamente o rótulo
  id?: string;
}

export default function SelectInput<T>({
  label,
  error,
  required,
  value,
  options,
  onChange,
  icon,
  name,
  id,
  ...props
}: SelectInputProps<T>) {

  // Gera um ID para o select (se não for passado) para associar ao FormField/Label
  const defaultId = useId();
  const selectId = id || defaultId;

  // Assume que o FormField usa o padrão 'ID-error' para a mensagem de erro
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <FormField label={label} error={error} required={required} id={selectId}>
      {icon && (
        <span
          className='absolute top-2.5 left-2 text-xl text-textSecondary shrink-0'
          // 1. ARIA OBRIGATÓRIO: Esconde o ícone decorativo
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <select
        id={selectId} // OBRIGATÓRIO: Para conexão explícita com o <label> no FormField
        value={value}
        name={String(name)}
        onChange={(e) => onChange(e.target.name as keyof T, e.target.value)}

        // 2. ARIA OBRIGATÓRIO: Indica o estado de erro
        aria-invalid={!!error}

        // 3. ARIA OBRIGATÓRIO: Conecta o select à mensagem de erro
        {...(errorId && { 'aria-describedby': errorId })}

        className={`w-full py-2 text-sm text-textPrimary rounded border focus:outline-none focus:border-neutralDarker ${
          error ? 'border-danger' : 'border-neutralDark'
        } ${icon ? 'pr-2 pl-7' : 'px-1'}`}
        {...props}
      >
        {/* Placeholder */}
        <option value='' disabled>
          Selecione um...
        </option>
        {/* Lista de opções */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
