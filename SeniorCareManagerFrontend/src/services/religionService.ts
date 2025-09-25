import Religion from "@/types/models/Religion";
import GenericService from "./genericService";

export default class ReligionService extends GenericService<Religion> {
    constructor() {
        super('Religion');
    }
}