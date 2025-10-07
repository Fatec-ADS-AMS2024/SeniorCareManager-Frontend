import Religion from '@/types/models/Religion';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<Religion>('Religion');

const ReligionService = {
  ...genericMethods,
}

export default ReligionService;
