export class GetQuizError extends Error {
    constructor(cause: unknown) {
        super('Unknown get quiz error.', { cause });
    }
}
