import Position from "@/types/models/Position";
import GenericService from "./genericService";

export default class PositionService extends GenericService<Position> {
    constructor() {
        super('Position');
    }
}