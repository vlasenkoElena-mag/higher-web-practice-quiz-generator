import { Either } from '@/utils/fp/tuple-based-either';

export class QuizGettingError extends Error {
    constructor(cause: unknown) {
        super('Unknown quiz getting error.', { cause });
    }
}

export const makeQuizGettingErrorResult = (cause: unknown) =>
    Either.left(new QuizGettingError(cause));
