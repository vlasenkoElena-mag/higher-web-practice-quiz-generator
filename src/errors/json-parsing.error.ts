export class JsonParsingError extends Error {
    constructor(cause: unknown) {
        super(`Unable to parse JSON.`, { cause });
    }
}
