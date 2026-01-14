import { getFirstElementOrFail } from '@/utils/dom-utils';
import { makeValidator, parseJsonObject } from '@/utils/validation';
import { quizSchema } from '@/schemas/quiz';
import { Either } from '@/utils/fp/tuple-based-either';
import { createEventEmitter } from '@/utils/event-emitter';
import type { JsonParsingError } from '@/errors/json-parsing.error';
import type { ValidationError } from '@/errors/validation.error';
import type { Observable } from '@/types/base';
import type { QuizData } from '@/types/quiz';

export type QuizGeneratorViewEvents = {
    ['submit']: { quiz: QuizData; };
    ['validation_error']: JsonParsingError | ValidationError;
};

export type QuizGeneratorView = Observable<QuizGeneratorViewEvents> & {
    clear(): void;
};

const validateQuizJson = makeValidator(quizSchema);

const safeParseQuizJson = (jsonString: string) =>
    Either.chain(validateQuizJson, parseJsonObject(jsonString));

export const createQuizGeneratorView = (element: HTMLElement): QuizGeneratorView => {
    const ee = createEventEmitter<QuizGeneratorViewEvents>();

    const form = getFirstElementOrFail('.generator__form', element) as HTMLFormElement;
    const textarea = getFirstElementOrFail('#quiz-json-input', form) as HTMLTextAreaElement;

    const toValid = () => textarea.classList.remove('generator__textarea--error');
    const toInvalid = () => textarea.classList.add('generator__textarea--error');

    form.addEventListener('submit', event => {
        event.preventDefault();
        const validationResult = safeParseQuizJson(textarea.value);
        Either.match(
            err => {
                toInvalid();
                ee.emit('validation_error', err);
            },
            quiz => ee.emit('submit', { quiz }),
            validationResult,
        );
    });

    textarea.addEventListener('input', () => {
        toValid();
    });

    const clear = () => {
        toValid();
        textarea.value = '';
    };

    return { clear, on: ee.on };
};
