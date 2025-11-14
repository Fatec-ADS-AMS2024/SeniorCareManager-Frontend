import TechnicalResponsibility from '@/types/models/TechnicalResponsibility';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<TechnicalResponsibility>(
  'TechnicalResponsibility'
);

const TechnicalResponsibilityService = {
  ...genericMethods,
};

export default TechnicalResponsibilityService;
