import { createEnumHelpers } from '@/utils/enumUtils';
import { Enum, EnumLabels } from '../app/Enum';

// Declaração do enum e seus valores
// A chave deve ser escrita em SNAKE_CASE maiúscula
const StatusEmployee: Enum = {
	ACTIVE: 1,
	FIRED: 2,
	PAID_LEAVE: 3,
	ANNUAL_LEAVE: 4
} as const;

type StatusEmployee =
  (typeof StatusEmployee)[keyof typeof StatusEmployee];

// Definição dos rótulos
const labels: EnumLabels = {
  [StatusEmployee.ACTIVE]: 'Ativo',
  [StatusEmployee.FIRED]: 'Demitido',
  [StatusEmployee.PAID_LEAVE]: 'Licença',
  [StatusEmployee.ANNUAL_LEAVE]: 'Férias',
};

// Criação das funções auxiliares para esse enum
const { getEnumLabel, getEnumOptions } = createEnumHelpers(
  StatusEmployee,
  labels
);

// Exportação das partes necessárias
// ATENÇÃO: as funções auxiliares devem ser exportadas com nomes diferentes para evitar conflito com outros enums
export {
  StatusEmployee,
  getEnumLabel as getStatusEmployeeLabel,
  getEnumOptions as getStatusEmployeeOptions,
};
