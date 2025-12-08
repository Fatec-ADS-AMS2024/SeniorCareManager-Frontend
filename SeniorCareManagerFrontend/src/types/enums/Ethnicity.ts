import { createEnumHelpers } from '@/utils/enumUtils';
import { Enum, EnumLabels } from '../app/Enum';

// Declaração do enum e seus valores
// A chave deve ser escrita em SNAKE_CASE maiúscula
const Ethnicity: Enum = {
  WHITE: 1,
  BLACK: 2,
  MIXED: 3,
  ASIAN: 4,
  INDIGENOUS: 5,
} as const;

type Ethnicity = (typeof Ethnicity)[keyof typeof Ethnicity];

// Definição dos rótulos
const labels: EnumLabels = {
  [Ethnicity.WHITE]: 'Branca',
  [Ethnicity.BLACK]: 'Preta',
  [Ethnicity.MIXED]: 'Parda',
  [Ethnicity.ASIAN]: 'Amarela',
  [Ethnicity.INDIGENOUS]: 'Indígena',
};

// Criação das funções auxiliares para esse enum
const { getEnumLabel, getEnumOptions } = createEnumHelpers(
  Ethnicity,
  labels
);

// Exportação das partes necessárias
// ATENÇÃO: as funções auxiliares devem ser exportadas com nomes diferentes para evitar conflito com outros enums
export {
  Ethnicity,
  getEnumLabel as getEthnicityLabel,
  getEnumOptions as getEthnicityOptions,
};
