import { createEnumHelpers } from '@/utils/enumUtils';
import { Enum, EnumLabels } from '../app/Enum';

// Declaração do enum e seus valores
// A chave deve ser escrita em SNAKE_CASE maiúscula
const Relationship: Enum = {
  FATHER: 1,
  MOTHER: 2,
  BROTHER_SISTER: 3,
  SON_DAUGHTER: 4,
  GRANDFATHER_GRANDMOTHER: 5,
  UNCLE_AUNT: 6,
  NEPHEW_NIECE: 7,
  COUSIN: 8,
  SPOUSE: 9,
} as const;

type Relationship = (typeof Relationship)[keyof typeof Relationship];

// Definição dos rótulos
const labels: EnumLabels = {
  [Relationship.FATHER]: 'Pai',
  [Relationship.MOTHER]: 'Mãe',
  [Relationship.BROTHER_SISTER]: 'Irmão/Irmã',
  [Relationship.SON_DAUGHTER]: 'Filho/Filha',
  [Relationship.GRANDFATHER_GRANDMOTHER]: 'Avô/Avó',
  [Relationship.UNCLE_AUNT]: 'Tio/Tia',
  [Relationship.NEPHEW_NIECE]: 'Sobrinho/Sobrinha',
  [Relationship.COUSIN]: 'Primo/Prima',
  [Relationship.SPOUSE]: 'Cônjuge',
};

// Criação das funções auxiliares para esse enum
const { getEnumLabel, getEnumOptions } = createEnumHelpers(
  Relationship,
  labels
);

// Exportação das partes necessárias
// ATENÇÃO: as funções auxiliares devem ser exportadas com nomes diferentes para evitar conflito com outros enums
export {
  Relationship,
  getEnumLabel as getRelationshipLabel,
  getEnumOptions as getRelationshipOptions,
};
