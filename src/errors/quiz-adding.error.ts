export class QuizAddingError extends Error {
    constructor(cause: unknown) {
        super(`Unknown quiz adding error`, { cause });
    }
}
