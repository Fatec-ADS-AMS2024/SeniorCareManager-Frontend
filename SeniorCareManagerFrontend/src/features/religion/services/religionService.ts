import Religion from '@/types/models/Religion';
import GenericService from '@/services/genericService';

export default class ReligionService extends GenericService<Religion> {
  constructor() {
    super('Religion');
  }
}
