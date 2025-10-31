import { createEnumHelpers } from '@/utils/enumUtils';
import { Enum, EnumLabels } from '../app/Enum';

// Declaração do enum e seus valores
// A chave deve ser escrita em SNAKE_CASE maiúscula
const HealthPlanType: Enum = {
  PUBLIC: 1,
  PRIVATE: 2,
} as const;

type HealthPlanType =
  (typeof HealthPlanType)[keyof typeof HealthPlanType];

// Definição dos rótulos
const labels: EnumLabels = {
  [HealthPlanType.PUBLIC]: 'Público',
  [HealthPlanType.PRIVATE]: 'Privado',
};

// Criação das funções auxiliares para esse enum
const { getEnumLabel, getEnumOptions } = createEnumHelpers(
  HealthPlanType,
  labels
);

// Exportação das partes necessárias
// ATENÇÃO: as funções auxiliares devem ser exportadas com nomes diferentes para evitar conflito com outros enums
export {
  HealthPlanType,
  getEnumLabel as getHealthInsurancePlanTypeLabel,
  getEnumOptions as getHealthInsurancePlanTypeOptions,
};
