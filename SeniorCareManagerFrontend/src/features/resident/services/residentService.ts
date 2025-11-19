import { api } from '@/features/api';
import ServiceResult from '@/types/app/ServiceResult';
import { handleServiceError } from '@/utils/serviceUtils';
import Resident from '@/types/models/Resident';
import ResidentAllergy from '@/types/models/ResidentAllergy';
import ResidentRelative from '@/types/models/ResidentRelative';

const endpoint = 'Resident/';

// DTOs para envio ao backend
export interface ResidentDTO {
  id?: number;
  registeredName: string;
  socialName: string; // Obrigatório no backend
  dateOfBirth: string; // ISO date string
  age: string;
  cpf: string;
  rg: string; // Obrigatório no backend
  issuingBody: string; // Obrigatório no backend
  issuingState: string; // Obrigatório no backend
  pisPasep: string; // Obrigatório no backend
  sex: number;
  maritalStatus: number; // Obrigatório no backend
  ethnicity: number; // Obrigatório no backend
  fatherName: string; // Obrigatório no backend
  motherName: string; // Obrigatório no backend
  spouseName?: string;
  nationalHealthCardNumber?: string;
  privateHealthCardNumber?: string;
  mobileNumber?: string;
  homePhoneNumber?: string;
  height?: number;
  weight?: number;
  religionId?: number;
  healthInsurancePlanId?: number;
}

export interface ResidentAllergyDTO {
  id?: number;
  residentId: number;
  allergyId: number;
}

export interface ResidentRelativeDTO {
  id?: number;
  residentId: number;
  relationship: string; // No backend é string, não number
  name: string;
  citizenship?: string;
  mobileNumber?: string;
  homePhoneNumber?: string;
  email?: string;
  street?: string;
  number?: string;
  addressComplement?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  issuingBody?: string;
  phoneNumber?: string;
}

const ResidentService = {
  // Métodos genéricos para Resident
  getAll: async (): Promise<ServiceResult<Resident[]>> => {
    try {
      const res = await api.get<Resident[]>(endpoint);
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  getById: async (id: number): Promise<ServiceResult<Resident>> => {
    try {
      const res = await api.get<Resident>(endpoint + id);
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  create: async (model: ResidentDTO): Promise<ServiceResult<Resident>> => {
    try {
      const res = await api.post<Resident>(endpoint, model as any);
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  update: async (
    id: number,
    model: ResidentDTO
  ): Promise<ServiceResult<Resident>> => {
    try {
      const res = await api.put<Resident>(endpoint + id, model as any);
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  deleteById: async (id: number): Promise<ServiceResult<undefined>> => {
    try {
      const res = await api.delete(endpoint + id);
      // O backend pode retornar uma resposta estruturada ou apenas status 204/200
      if (res.data && typeof res.data === 'object' && 'success' in res.data) {
        return {
          success: res.data.success,
          message: res.data.message || 'Excluído com sucesso',
          data: undefined,
        };
      }
      // Se não houver resposta estruturada, assume sucesso (status 204/200)
      return { success: true, message: 'Excluído com sucesso' };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  // Métodos específicos para alergias do residente
  getAllergies: async (
    residentId: number
  ): Promise<ServiceResult<ResidentAllergy[]>> => {
    try {
      const res = await api.get<ResidentAllergy[]>(
        `${endpoint}${residentId}/Allergies`
      );
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  addAllergy: async (
    residentId: number,
    allergyId: number
  ): Promise<ServiceResult<ResidentAllergy>> => {
    try {
      const model: ResidentAllergyDTO = {
        residentId,
        allergyId,
      };
      const res = await api.post<ResidentAllergy>(
        `${endpoint}${residentId}/Allergies`,
        model as any
      );
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  removeAllergy: async (
    residentId: number,
    allergyId: number
  ): Promise<ServiceResult<undefined>> => {
    try {
      await api.delete(`${endpoint}${residentId}/Allergies/${allergyId}`);
      return { success: true, message: 'Alergia removida com sucesso' };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  // Métodos específicos para familiares do residente
  getRelatives: async (
    residentId: number
  ): Promise<ServiceResult<ResidentRelative[]>> => {
    try {
      const res = await api.get<ResidentRelative[]>(
        `${endpoint}${residentId}/Relatives`
      );
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  addRelative: async (
    residentId: number,
    relative: ResidentRelativeDTO
  ): Promise<ServiceResult<ResidentRelative>> => {
    try {
      const model: ResidentRelativeDTO = {
        ...relative,
        residentId,
      };
      const res = await api.post<ResidentRelative>(
        `${endpoint}${residentId}/Relatives`,
        model as any
      );
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  updateRelative: async (
    residentId: number,
    relativeId: number,
    relative: ResidentRelativeDTO
  ): Promise<ServiceResult<ResidentRelative>> => {
    try {
      const model: ResidentRelativeDTO = {
        ...relative,
        residentId,
      };
      const res = await api.put<ResidentRelative>(
        `${endpoint}${residentId}/Relatives/${relativeId}`,
        model as any
      );
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  removeRelative: async (
    residentId: number,
    relativeId: number
  ): Promise<ServiceResult<undefined>> => {
    try {
      await api.delete(`${endpoint}${residentId}/Relatives/${relativeId}`);
      return { success: true, message: 'Familiar removido com sucesso' };
    } catch (error) {
      return handleServiceError(error);
    }
  },
};

export default ResidentService;

