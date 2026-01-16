export class IllegalJsonError extends Error {
    constructor(cause: unknown) {
        super(`Unable to parse JSON.`, { cause });
    }
}
