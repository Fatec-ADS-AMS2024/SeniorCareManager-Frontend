import { useState } from "react";
import { ApiResponse } from "../types";
import { useAlert } from "../../../contexts/AlertContext";

interface HandleRequestOptions {
  successMessage?: string;
}

export default function useApiHandler<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { showAlert } = useAlert();

  const handleRequest = async (
    serviceMethod: () => Promise<ApiResponse<T>>,
    options?: HandleRequestOptions
  ) => {
    setLoading(true);
    setError(null);
    const result = await serviceMethod();
    setLoading(false);

    if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
      const errorMessage = result.errors[0]?.message || 'Ocorreu um erro.';
      setError(errorMessage);
      showAlert(errorMessage, 'error');
    } else if (result.errors) {
      const errorMessage = String(result.errors);
      setError(errorMessage);
      showAlert(errorMessage, 'error');
    } else {
      setData(result.data ?? null);
      if (options?.successMessage) {
        showAlert(options.successMessage, 'success');
      }
    }
  };

  return { data, error, loading, handleRequest };
}