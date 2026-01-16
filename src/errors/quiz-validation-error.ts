export class QuizValidationError extends Error {
    constructor(message?: string) {
        super(`Quiz validation error: ${message}`);
    }
};
