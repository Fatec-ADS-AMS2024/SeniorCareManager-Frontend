import { createEnumHelpers } from '@/utils/enumUtils';
import { Enum, EnumLabels } from '../app/Enum';

// Declaração do enum e seus valores
// A chave deve ser escrita em SNAKE_CASE maiúscula
const Sex: Enum = {
  MALE: 1,
  FEMALE: 2,
} as const;

type Sex = (typeof Sex)[keyof typeof Sex];

// Definição dos rótulos
const labels: EnumLabels = {
  [Sex.MALE]: 'Masculino',
  [Sex.FEMALE]: 'Feminino',
};

// Criação das funções auxiliares para esse enum
const { getEnumLabel, getEnumOptions } = createEnumHelpers(Sex, labels);

// Exportação das partes necessárias
// ATENÇÃO: as funções auxiliares devem ser exportadas com nomes diferentes para evitar conflito com outros enums
export {
  Sex,
  getEnumLabel as getSexLabel,
  getEnumOptions as getSexOptions,
};
