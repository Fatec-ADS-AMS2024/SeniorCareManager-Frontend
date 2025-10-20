import { useState } from 'react';

export default function useFormData<T>(initial: Partial<T>) {
  const [data, setData] = useState<Partial<T>>(initial);

  const updateField = (fieldName: keyof T, value: unknown) => {
    setData((prev) => ({ ...prev, [fieldName]: value }));
  };

  return { data, updateField, setData };
}
