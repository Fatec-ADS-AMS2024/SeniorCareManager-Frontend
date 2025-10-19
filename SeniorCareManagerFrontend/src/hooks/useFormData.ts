import { useState } from 'react';

export default function useFormData<T>(initial: T) {
  const [data, setData] = useState<T>(initial);

  const updateField = (fieldName: keyof T, value: unknown) => {
    setData((prev) => ({ ...prev, [fieldName]: value }));
  };

  return { data, updateField, setData };
}
