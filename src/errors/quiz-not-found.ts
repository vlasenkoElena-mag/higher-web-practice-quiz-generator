export class QuizNotFoundError extends Error {
    constructor(quizId: string) {
        super(`Quiz not found. Id: ${quizId}`);
    }
}
