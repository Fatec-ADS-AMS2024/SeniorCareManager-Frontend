import GenericService from "./genericService";

export default class ReligionService extends GenericService<{
    id: number,
    name: string,
}> {
    constructor() {
        super('Religion');
    }
}