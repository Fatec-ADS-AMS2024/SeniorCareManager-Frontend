export default class ServiceResult<T> {
    code: number;
    message?: string;
    data?: T | T[];

    constructor(code: number, message?: string, data?: T | T[]) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}