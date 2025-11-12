import { useState } from "react";
import { ApiResponse } from "../types";

export default function useApiHandler<T>(serviceMethod: () => Promise<ApiResponse<T>>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const handleRequest = async () => {
    setLoading(true);
    setError(null);
    const result = await serviceMethod();
    setLoading(false);

    if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
      setError(result.errors[0]?.message || 'Ocorreu um erro.');
    } else if (result.errors) {
      setError(String(result.errors));
    } else {
      setData(result.data ?? null);
    }
  };

  return { data, error, loading, handleRequest };
}