export class QuizGettingError extends Error {
    constructor(cause: unknown) {
        super('Unknown quiz getting error.', { cause });
    }
}
