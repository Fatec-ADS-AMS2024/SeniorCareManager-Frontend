import { createEnumHelpers } from '@/utils/enumUtils';
import { Enum, EnumLabels } from '../app/Enum';

// Declaração do enum e seus valores
// A chave deve ser escrita em SNAKE_CASE maiúscula
const UserStatus: Enum = {
  ACTIVE: 1,
  INACTIVE: 2,
  BLOCKED: 3,
} as const;

type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// Definição dos rótulos
const labels: EnumLabels = {
  [UserStatus.ACTIVE]: 'Ativo',
  [UserStatus.INACTIVE]: 'Inativo',
  [UserStatus.BLOCKED]: 'Bloqueado',
};

// Criação das funções auxiliares para esse enum
const { getEnumLabel, getEnumOptions } = createEnumHelpers(UserStatus, labels);

// Exportação das partes necessárias
// ATENÇÃO: as funções auxiliares devem ser exportadas com nomes diferentes para evitar conflito com outros enums
export {
  UserStatus,
  getEnumLabel as getUserStatusLabel,
  getEnumOptions as getUserStatusOptions,
};
