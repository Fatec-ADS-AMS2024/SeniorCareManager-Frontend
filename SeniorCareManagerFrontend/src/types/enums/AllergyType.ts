import { createEnumHelpers } from '@/utils/enumUtils';
import { Enum, EnumLabels } from '../app/Enum';

// Declaração do enum e seus valores
// A chave deve ser escrita em SNAKE_CASE maiúscula
const AllergyType: Enum = {
  MEDICATION: 1,
  FOOD: 2,
  ENVIRONMENTAL: 3,
  INSECT_STING: 4,
  ANIMAL: 5,
  LATEX: 6,
  OTHER: 7,
} as const;

type AllergyType = (typeof AllergyType)[keyof typeof AllergyType];

// Definição dos rótulos
const labels: EnumLabels = {
  [AllergyType.MEDICATION]: 'Medicamento',
  [AllergyType.FOOD]: 'Alimento',
  [AllergyType.ENVIRONMENTAL]: 'Ambiental',
  [AllergyType.INSECT_STING]: 'Picada de inseto',
  [AllergyType.ANIMAL]: 'Animal',
  [AllergyType.LATEX]: 'Látex',
  [AllergyType.OTHER]: 'Outro',
};

// Criação das funções auxiliares para esse enum
const { getEnumLabel, getEnumOptions } = createEnumHelpers(
  AllergyType,
  labels
);

// Exportação das partes necessárias
// ATENÇÃO: as funções auxiliares devem ser exportadas com nomes diferentes para evitar conflito com outros enums
export {
  AllergyType,
  getEnumLabel as getAllergyTypeLabel,
  getEnumOptions as getAllergyTypeOptions,
};
