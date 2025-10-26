import { createEnumHelpers } from '@/utils/enumUtils';
import { Enum, EnumLabels } from '../app/Enum';

// Declaração do enum e seus valores
// A chave deve ser escrita em SNAKE_CASE maiúscula
const HealthInsurancePlanType: Enum = {
  PUBLIC: 1,
  PRIVATE: 2,
} as const;

type HealthInsurancePlanType =
  (typeof HealthInsurancePlanType)[keyof typeof HealthInsurancePlanType];

// Definição dos rótulos
const labels: EnumLabels = {
  [HealthInsurancePlanType.PUBLIC]: 'Público',
  [HealthInsurancePlanType.PRIVATE]: 'Privado',
};

// Criação das funções auxiliares para esse enum
const { getEnumLabel, getEnumOptions } = createEnumHelpers(
  HealthInsurancePlanType,
  labels
);

// Exportação das partes necessárias
// ATENÇÃO: as funções auxiliares devem ser exportadas com nomes diferentes para evitar conflito com outros enums
export {
  HealthInsurancePlanType,
  getEnumLabel as getHealthInsurancePlanTypeLabel,
  getEnumOptions as getHealthInsurancePlanTypeOptions,
};
