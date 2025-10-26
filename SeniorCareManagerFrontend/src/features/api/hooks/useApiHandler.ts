import { useState } from "react";
import { ApiResponse } from "../types";

export default function useApiHandler<T>(serviceMethod: () => Promise<ApiResponse<{ id: number }>>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const handleRequest = async () => {
    setLoading(true);
    setError(null);
    const result = await serviceMethod();
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setData(result.data);
    }
  };

  return { data, error, loading, handleRequest };
}
