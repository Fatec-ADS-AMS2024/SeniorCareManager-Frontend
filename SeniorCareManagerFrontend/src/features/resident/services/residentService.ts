import ServiceResult from '@/types/app/ServiceResult';
import generateGenericMethods, {
  handleServiceError,
} from '@/utils/serviceUtils';
import Resident from '@/types/models/Resident';
import ResidentAllergy from '@/types/models/ResidentAllergy';
import ResidentRelative from '@/types/models/ResidentRelative';
import ResidentAllergyService from './residentAllergyService';
import ResidentRelativeService from './residentRelativeService';

const genericMethods = generateGenericMethods<Resident>('Resident');

const ResidentService = {
  ...genericMethods,

  // Métodos específicos para alergias do residente
  getAllergies: async (
    residentId: number
  ): Promise<ServiceResult<ResidentAllergy[]>> => {
    try {
      const residentAllergiesRes = await ResidentAllergyService.getAll();
      if (!residentAllergiesRes.success || !residentAllergiesRes.data) {
        return residentAllergiesRes;
      }

      const filteredAllergies = residentAllergiesRes.data.filter(
        (ra) => ra.residentId === residentId
      );

      return {
        success: true,
        message: 'Alergias do residente obtidas com sucesso',
        data: filteredAllergies,
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
      const residentAllergies = await ResidentAllergyService.getAll();
      if (!residentAllergies.success || !residentAllergies.data) {
        return {
          message: 'Ocorreu um erro ao procurar a alergia do residente',
          success: false,
        };
      }

      const allergyToRemove = residentAllergies.data.find(
        (ra) => ra.residentId === residentId && ra.allergyId === allergyId
      );

      if (!allergyToRemove) {
        return {
          success: false,
          message: 'Alergia não encontrada para este residente',
        };
      }

      await ResidentAllergyService.deleteById(allergyToRemove.id);
      return {
        success: true,
        message: 'Alergia removida com sucesso',
      };
    } catch (error) {
      return handleServiceError(error);
    }
  },

  getRelatives: async (
    residentId: number
  ): Promise<ServiceResult<ResidentRelative[]>> => {
    try {
      const residentRelativesRes = await ResidentRelativeService.getAll();
      if (!residentRelativesRes.success || !residentRelativesRes.data) {
        return residentRelativesRes;
      }

      const filteredRelatives = residentRelativesRes.data.filter(
        (ra) => ra.residentId === residentId
      );

      return {
        success: true,
        message: 'Parentes do residente obtidos com sucesso',
        data: filteredRelatives,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  },
};

export default ResidentService;
