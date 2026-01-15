export class QuizzesLoadingError extends Error {
    constructor(cause: unknown) {
        super(`Unknown quiz loading error`, { cause });
    }
}
