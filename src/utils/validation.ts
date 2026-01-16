import type { z } from 'zod';
import { QuizValidationError } from '@/errors/quiz-validation-error';
import { IllegalJsonError } from '@/errors/illegal-json-error';

type ValidatorFactory = <T extends z.ZodType>(schema: T) => (data: object) => ValidationResult<z.infer<T>>;
type ValidationResult<T> = [QuizValidationError, null] | [null, T];

export const parseJson = (jsonString: string): [QuizValidationError, null] | [null, unknown]  => {
    try {
        const parsed = JSON.parse(jsonString);
        return [null, parsed];
    }
    catch (error) {
        return [new IllegalJsonError(error), null];
    }
};

export const parseJsonObject = (jsonString: string): [QuizValidationError, null] | [null, object] =>
    {
        const [err, parsed] = parseJson(jsonString)

        if (err !== null || !(typeof parsed === 'object' && parsed !== null)) {
            return [new IllegalJsonError('Parsed JSON is not an object'), null];
        }

        return [null, parsed];
    };

export const makeValidator: ValidatorFactory
    = <T extends z.ZodType>(schema: T) => (data: object): ValidationResult<z.infer<T>> => {
        const result = schema.safeParse(data);

        return result.success
            ? [null, result.data]
            : [new QuizValidationError(result.error.message), null];
    };
