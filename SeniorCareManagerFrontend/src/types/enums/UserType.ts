import { createEnumHelpers } from '@/utils/enumUtils';
import { Enum, EnumLabels } from '../app/Enum';

// Declaração do enum e seus valores
// A chave deve ser escrita em SNAKE_CASE maiúscula
const UserType: Enum = {
  ADMIN: 1,
  MANAGER: 2,
  OPERATOR: 3,
  NURSE: 4,
  PHYSIOTHERAPIST: 5,
  NUTRITIONIST: 6,
  PSYCHOLOGIST: 7,
  DOCTOR: 8,
  NURSINGTECHNICIAN: 9,
} as const;

type UserType = (typeof UserType)[keyof typeof UserType];

// Definição dos rótulos
const labels: EnumLabels = {
  [UserType.ADMIN]: 'Administrador',
  [UserType.MANAGER]: 'Gerente',
  [UserType.OPERATOR]: 'Operador',
  [UserType.NURSE]: 'Enfermeiro',
  [UserType.PHYSIOTHERAPIST]: 'Fisioterapeuta',
  [UserType.NUTRITIONIST]: 'Nutricionista',
  [UserType.PSYCHOLOGIST]: 'Psicologo',
  [UserType.DOCTOR]: 'Doutor',
  [UserType.NURSINGTECHNICIAN]: 'Tecnico de Enfermagem',
};

// Criação das funções auxiliares para esse enum
const { getEnumLabel, getEnumOptions } = createEnumHelpers(UserType, labels);

// Exportação das partes necessárias
// ATENÇÃO: as funções auxiliares devem ser exportadas com nomes diferentes para evitar conflito com outros enums
export {
  UserType,
  getEnumLabel as getUserTypeLabel,
  getEnumOptions as getUserTypeOptions,
};
