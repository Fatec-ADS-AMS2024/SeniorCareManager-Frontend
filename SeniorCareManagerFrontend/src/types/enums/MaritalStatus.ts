import { createEnumHelpers } from '@/utils/enumUtils';
import { Enum, EnumLabels } from '../app/Enum';

// Declaração do enum e seus valores
// A chave deve ser escrita em SNAKE_CASE maiúscula
const MaritalStatus: Enum = {
  SINGLE: 1,
  MARRIED: 2,
  WIDOWED: 3,
  DIVORCED: 4,
  SEPARATED: 5,
  CIVIL_UNION: 6,
} as const;

type MaritalStatus = (typeof MaritalStatus)[keyof typeof MaritalStatus];

// Definição dos rótulos
const labels: EnumLabels = {
  [MaritalStatus.SINGLE]: 'Solteiro(a)',
  [MaritalStatus.MARRIED]: 'Casado(a)',
  [MaritalStatus.WIDOWED]: 'Viúvo(a)',
  [MaritalStatus.DIVORCED]: 'Divorciado(a)',
  [MaritalStatus.SEPARATED]: 'Separado(a)',
  [MaritalStatus.CIVIL_UNION]: 'União estável',
};

// Criação das funções auxiliares para esse enum
const { getEnumLabel, getEnumOptions } = createEnumHelpers(
  MaritalStatus,
  labels
);

// Exportação das partes necessárias
// ATENÇÃO: as funções auxiliares devem ser exportadas com nomes diferentes para evitar conflito com outros enums
export {
  MaritalStatus,
  getEnumLabel as getMaritalStatusLabel,
  getEnumOptions as getMaritalStatusOptions,
};
