import axios from "axios";

// TODO implementar validações básicas
export default abstract class GenericService<T> {
    protected readonly baseUrl: string;

    constructor(modelName: string) {
        this.baseUrl = `https://localhost:7053/api/v1/${modelName}/`;
    }

    async getAll(): Promise<T[]> {
        const res = await axios.get(this.baseUrl);
        return res.data;
    }

    async getById(id: number): Promise<T> {
        const res = await axios.get(this.baseUrl + id);
        return res.data;
    }

    async create(model: T): Promise<T> {
        const res = await axios.post(this.baseUrl, model);
        return res.data;
    }

    async update(id: number, model: T): Promise<T> {
        const res = await axios.put(this.baseUrl + id, model);
        return res.data;
    }

    async delete(id: number): Promise<string> {
        const res = await axios.delete(this.baseUrl + id);
        return res.data;
    }
}