import ResidentRelative from '@/types/models/ResidentRelative';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<ResidentRelative>('ResidentRelative');

const ResidentRelativeService = {
  ...genericMethods,
};

export default ResidentRelativeService;
