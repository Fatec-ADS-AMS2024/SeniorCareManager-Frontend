import Company from '@/types/models/Company';
import generateGenericMethods from '@/utils/serviceUtils';

// Tente uma destas opções caso o backend use outro padrão:
// 'Company' - primeira letra maiúscula singular
// 'company' - tudo minúsculo
// 'Companies' - plural com primeira letra maiúscula
// 'companies' - plural tudo minúsculo
const genericMethods = generateGenericMethods<Company>(
  'Company'  // ← VOLTANDO PARA O PADRÃO ORIGINAL
);

const CompanyService = {
  ...genericMethods,
};

export default CompanyService;
