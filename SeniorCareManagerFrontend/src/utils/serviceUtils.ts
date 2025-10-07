import { api } from '@/features/api';
import { ApiResponse } from '@/features/api';
import { FieldError } from '@/features/api/types';

export default function generateGenericMethods<T extends { id: number }>(
  modelName: string
) {
  const modelEndpoint = `${modelName}/`;

  const getAll = async () => {
    try {
      const res = await api.get<T[]>(modelEndpoint);

      return res.data;
    } catch (error) {
      throw new Error(String(error));
    }
  };

  const getById = async (id: number): Promise<ApiResponse<T>> => {
    try {
      const res = await api.get<T>(modelEndpoint + id);

      return res.data;
    } catch (error) {
      throw new Error(String(error));
    }
  };

  const create = async (model: T): Promise<ApiResponse<T>> => {
    try {
      const res = await api.post<T>(modelEndpoint, model);

      return res.data;
    } catch (error) {
      throw new Error(String(error));
    }
  };

  const update = async (id: number, model: T): Promise<ApiResponse<T>> => {
    try {
      const res = await api.put<T>(modelEndpoint + id, model);

      return res.data;
    } catch (error) {
      throw new Error(String(error));
    }
  };

  const deleteById = async (id: number): Promise<ApiResponse<T>> => {
    try {
      const res = await api.delete<T>(modelEndpoint + id);

      return res.data;
    } catch (error) {
      throw new Error(String(error));
    }
  };

  return {
    getAll,
    getById,
    create,
    update,
    deleteById,
  };
}

export function handleApiResponse<T>(response: ApiResponse<T>) {
  try {
    // Se a resposta for bem-sucedida (success: true)
    if (response.success) {
      return { data: response.data, error: null };
    }

    // Se houver erros específicos (campo "errors")
    if (response.errors && response.errors.length > 0) {
      return { data: null, error: formatErrors(response.errors) };
    }

    // Caso contrário, retorne a mensagem de erro genérica
    return { data: null, error: response.message || 'Erro desconhecido' };
  } catch (error) {
    // Captura qualquer erro inesperado
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

function formatErrors(errors: FieldError[]): string {
  return errors.map((e) => e.message || 'Erro desconhecido').join(', '); // Junta os erros, separando-os por vírgula
}
