import Resident from "../types/models/Resident";
import GenericService from "./genericService";

export default class ResidentService extends GenericService<Resident> {
    constructor() {
        super('Resident');
    }
}