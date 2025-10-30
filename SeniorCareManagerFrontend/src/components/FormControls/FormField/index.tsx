import { XCircle } from '@phosphor-icons/react';
import React from 'react';

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  // Adiciona 'id' para que o label possa ser associado ao campo (input/select)
  id?: string;
}

/**
 * Este componente é utilizado para fornecer elementos básicos aos campos de um
 * formulário, como label e espaço para mensagem de erro.
 */
export function FormField({
  label,
  error,
  required,
  children,
  id,
}: FormFieldProps) {

  const errorId = id ? `${id}-error` : undefined;

  return (
    <div
      aria-live={error ? 'assertive' : 'off'}
    >
      {label && (
        <label
          className='block text-textPrimary text-sm mb-1 break-all'
          {...(id && { htmlFor: id })}
        >
          {label}
          {required && '*'}
        </label>
      )}
      <div className='relative'>{children}</div>
      {error && (
        <span
          className='text-danger text-xs flex gap-1 items-center'
          {...(errorId && { id: errorId })}
        >
          <XCircle />
          {error}
        </span>
      )}
    </div>
  );
}
