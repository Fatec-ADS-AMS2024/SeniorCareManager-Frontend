import Company from '@/types/models/Company';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<Company>(
  'Company'
);

const CompanyService = {
  ...genericMethods,
};

export default CompanyService;
