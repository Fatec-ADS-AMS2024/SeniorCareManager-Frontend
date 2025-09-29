import Position from '@/types/models/Position';
import GenericService from '@/services/genericService';

export default class PositionService extends GenericService<Position> {
  constructor() {
    super('Position');
  }
}
