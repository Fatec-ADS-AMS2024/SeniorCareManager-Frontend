import Position from '@/types/models/Position';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<Position>(
  'Position'
);

const PositionService = {
  ...genericMethods,
};

export default PositionService;
