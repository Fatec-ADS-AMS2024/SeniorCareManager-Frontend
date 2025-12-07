export default interface ResidentAllergy {
  id: number;
  description?: string;
  detectionDate?: Date | string;
  releasedDate?: Date | string;
  residentId: number;
  allergyId: number;
}

