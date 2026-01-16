export class AddQuizError extends Error {
    constructor(cause: unknown) {
        super(`Unknown add quiz error`, { cause });
    }
}
