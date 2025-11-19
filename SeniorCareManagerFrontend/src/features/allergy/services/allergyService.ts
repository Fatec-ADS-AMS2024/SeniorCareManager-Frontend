import Allergy from '@/types/models/Allergy';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<Allergy>('Allergy');

const AllergyService = {
  ...genericMethods,
};

export default AllergyService;

