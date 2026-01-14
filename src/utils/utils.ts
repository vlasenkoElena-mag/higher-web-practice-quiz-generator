export const noop = () => {};

type IsDefined = <T>(value: T | undefined) => value is T;
export const isDefined: IsDefined = value => value !== undefined;

type IsUndefined = <T>(value: T | undefined) => value is undefined;
export const isUndefined: IsUndefined = value => typeof value === 'undefined';

type Nil = undefined | null;
export const isNil = (value: unknown): value is Nil => value === undefined || value === null;

export const assert = (predicate: boolean, errorMessage: string) => {
    if (!predicate) {
        throw new Error(`Assertion error: ${errorMessage}`, { });
    }
};

export const asArray = <T>(value: T | T[]): T[] => Array.isArray(value) ? value : [value];

export const formatPrice = (price: number): string => `$${price} синапсов`;
