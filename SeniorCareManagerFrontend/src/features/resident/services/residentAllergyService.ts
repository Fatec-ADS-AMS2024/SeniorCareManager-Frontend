import ResidentAllergy from '@/types/models/ResidentAllergy';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<ResidentAllergy>('ResidentAllergy');

const ResidentAllergyService = {
  ...genericMethods,
};

export default ResidentAllergyService;
