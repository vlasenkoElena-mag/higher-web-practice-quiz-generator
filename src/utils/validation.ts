import type { z } from 'zod';
import { ValidationError } from '@/errors/validation.error';
import { JsonParsingError } from '@/errors/json-parsing.error';

type ValidatorFactory = <T extends z.ZodType>(schema: T) => (data: object) => ValidationResult<z.infer<T>>;
type ValidationResult<T> = [ValidationError, null] | [null, T];

export const parseJson = (jsonString: string): [ValidationError, null] | [null, unknown]  => {
    try {
        const parsed = JSON.parse(jsonString);
        return [null, parsed];
    }
    catch (error) {
        return [new JsonParsingError(error), null];
    }
};

export const parseJsonObject = (jsonString: string): [ValidationError, null] | [null, object] =>
    {
        const [err, parsed] = parseJson(jsonString)

        if (err !== null || !(typeof parsed === 'object' && parsed !== null)) {
            return [new JsonParsingError('Parsed JSON is not an object'), null];
        }

        return [null, parsed];
    };

export const makeValidator: ValidatorFactory
    = <T extends z.ZodType>(schema: T) => (data: object): ValidationResult<z.infer<T>> => {
        const result = schema.safeParse(data);

        return result.success
            ? [null, result.data]
            : [new ValidationError(result.error.message), null];
    };
