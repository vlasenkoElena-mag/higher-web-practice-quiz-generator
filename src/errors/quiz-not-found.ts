import { Either } from '@/utils/fp/tuple-based-either';

export class QuizNotFoundError extends Error {
    constructor(quizId: string) {
        super(`Quiz not found. Id: ${quizId}`);
    }
}

export const makeNotFoundResult = (quizId: string) =>
    Either.left(new QuizNotFoundError(quizId));
