import React, { useState } from 'react';
import { FormField } from '../FormField';
import { BaseFieldProps } from '../types';

interface FileInputProps<T> extends BaseFieldProps {
  name: keyof T;
  onChange: (attribute: keyof T, value: string) => void;
  accept?: string;
}

export default function FileInput<T>({
  label,
  error,
  required,
  name,
  onChange,
  accept = 'image/*',
}: FileInputProps<T>) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onChange(name, result);
    };
    reader.readAsDataURL(file);
  };

  const inputId = `file-${String(name)}`;

  return (
    <FormField label={label} error={error} required={required}>
      <input
        id={inputId}
        title={label ?? String(name)}
        aria-label={label ?? String(name)}
        type="file"
        accept={accept}
        onChange={handleChange}
        className={`w-full py-2 text-sm text-textPrimary rounded border focus:outline-none focus:border-neutralDarker ${
          error ? 'border-danger' : 'border-neutralDark'
        } px-2`}
      />
      {preview && (
        <img
          src={preview}
          alt={String(name)}
          className="mt-2 max-h-24 object-contain rounded"
        />
      )}
    </FormField>
  );
}