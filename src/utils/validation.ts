import type { z } from 'zod';
import { Either } from './fp/tuple-based-either';
import { ValidationError } from '@/errors/validation.error';
import { JsonParsingError } from '@/errors/json-parsing.error';

type ValidatorFactory = <T extends z.ZodType>(schema: T) => (data: object) => ValidationResult<z.infer<T>>;
type ValidationResult<T> = Either<ValidationError, T>;

export const parseJson = (jsonString: string): Either<ValidationError, unknown> => {
    try {
        const parsed = JSON.parse(jsonString);
        return Either.right(parsed);
    }
    catch (error) {
        return Either.left(new JsonParsingError(error));
    }
};

export const parseJsonObject = (jsonString: string): Either<JsonParsingError, object> =>
    Either.chain(
        parsed => typeof parsed === 'object' && parsed !== null
            ? Either.right(parsed)
            : Either.left(new JsonParsingError('Parsed JSON is not an object')),
        parseJson(jsonString),
    );

export const makeValidator: ValidatorFactory
    = <T extends z.ZodType>(schema: T) => (data: object): ValidationResult<z.infer<T>> => {
        const result = schema.safeParse(data);

        return result.success
            ? Either.right(result.data)
            : Either.left(new ValidationError(result.error.message));
    };
