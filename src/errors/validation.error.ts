export class ValidationError extends Error {
    constructor(message?: string) {
        super(`Quiz validation error: ${message}`);
    }
};
