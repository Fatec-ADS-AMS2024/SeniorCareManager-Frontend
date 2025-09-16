export enum HealthInsurancePlanType {
  Public = 1,
  Private = 2,
}

export default interface HealthInsurancePlan {
  id: number;
  name: string;
  type: HealthInsurancePlanType;
  abbreviation: string;
}

export function getHealthInsurancePlanTypeLabel(type: HealthInsurancePlanType): string {
  return {
    [HealthInsurancePlanType.Public]: "Público",
    [HealthInsurancePlanType.Private]: "Privado",
  }[type] ?? "Desconhecido";
}

export function getHealthInsurancePlanTypeOptions() {
  return Object.values(HealthInsurancePlanType)
    .filter((v) => typeof v === "number")
    .map((value) => ({
      label: getHealthInsurancePlanTypeLabel(value as HealthInsurancePlanType),
      value: value as HealthInsurancePlanType,
    }));
}