import { Enum, EnumLabels } from '@/types/app';

/**
 *
 * @param enumObject O enum a ser tratado
 * @param labels A constante contendo o mapeamento dos valores do enum para rótulos amigáveis para o usuário
 * @returns Funções para pegar o rótulo de um valor e gerar uma lista de opções
 */
export function createEnumHelpers(enumObject: Enum, labels: EnumLabels) {
  function getEnumLabel(value: Enum[keyof Enum]): string {
    return labels[value] ?? 'Desconhecido';
  }

  function getEnumOptions() {
    return Object.values(enumObject)
      .filter((v) => typeof v === 'number')
      .map((value) => ({
        label: getEnumLabel(value),
        value: value,
      }));
  }

  return { getEnumLabel, getEnumOptions };
}
