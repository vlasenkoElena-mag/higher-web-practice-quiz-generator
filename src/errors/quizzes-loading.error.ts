import { Either } from '@/utils/fp/tuple-based-either';

export class QuizzesLoadingError extends Error {
    constructor(cause: unknown) {
        super(`Unknown quiz loading error`, { cause });
    }
}

export const makeQuizzesLoadingErrorResult = (cause: unknown) =>
    Either.left(new QuizzesLoadingError(cause));
