import { Either } from '@/utils/fp/tuple-based-either';

export class QuizAddingError extends Error {
    constructor(cause: unknown) {
        super(`Unknown quiz adding error`, { cause });
    }
}

export const makeQuizAddingErrorResult = (cause: unknown) =>
    Either.left(new QuizAddingError(cause));
