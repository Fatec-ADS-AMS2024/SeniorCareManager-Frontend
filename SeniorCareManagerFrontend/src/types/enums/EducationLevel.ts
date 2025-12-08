import { createEnumHelpers } from '@/utils/enumUtils';
import { Enum, EnumLabels } from '../app/Enum';

// Declaração do enum e seus valores
// A chave deve ser escrita em SNAKE_CASE maiúscula
const EducationLevel: Enum = {
  NO_SCHOOLING: 1,
  ELEMENTARY_SCHOOL_COMPLETED: 2,
  ELEMENTARY_SCHOOL_INCOMPLETE: 3,
  HIGH_SCHOOL_COMPLETED: 4,
  HIGH_SCHOOL_INCOMPLETE: 5,
  HIGHER_EDUCATION_COMPLETED: 6,
  HIGHER_EDUCATION_INCOMPLETE: 7,
  POSTGRADUATE: 8,
} as const;

type EducationLevel = (typeof EducationLevel)[keyof typeof EducationLevel];

// Definição dos rótulos
const labels: EnumLabels = {
  [EducationLevel.NO_SCHOOLING]: 'Sem escolaridade',
  [EducationLevel.ELEMENTARY_SCHOOL_COMPLETED]: 'Ensino fundamental completo',
  [EducationLevel.ELEMENTARY_SCHOOL_INCOMPLETE]: 'Ensino fundamental incompleto',
  [EducationLevel.HIGH_SCHOOL_COMPLETED]: 'Ensino médio completo',
  [EducationLevel.HIGH_SCHOOL_INCOMPLETE]: 'Ensino médio incompleto',
  [EducationLevel.HIGHER_EDUCATION_COMPLETED]: 'Ensino superior completo',
  [EducationLevel.HIGHER_EDUCATION_INCOMPLETE]: 'Ensino superior incompleto',
  [EducationLevel.POSTGRADUATE]: 'Pós-graduação',
};

// Criação das funções auxiliares para esse enum
const { getEnumLabel, getEnumOptions } = createEnumHelpers(
  EducationLevel,
  labels
);

// Exportação das partes necessárias
// ATENÇÃO: as funções auxiliares devem ser exportadas com nomes diferentes para evitar conflito com outros enums
export {
  EducationLevel,
  getEnumLabel as getEducationLevelLabel,
  getEnumOptions as getEducationLevelOptions,
};
