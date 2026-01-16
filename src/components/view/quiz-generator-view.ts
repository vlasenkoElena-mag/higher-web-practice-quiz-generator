import { getFirstElementOrFail } from '@/utils/dom-utils';
import { makeValidator, parseJsonObject } from '@/utils/validation';
import { quizSchema } from '@/schemas/quiz';
import { createEventEmitter } from '@/utils/event-emitter';
import type { IllegalJsonError } from '@/errors/illegal-json-error';
import type { QuizValidationError } from '@/errors/quiz-validation-error';
import type { Observable } from '@/types/base';
import type { QuizData } from '@/types/quiz';

export type QuizGeneratorViewEvents = {
    ['submit']: { quiz: QuizData };
    ['validation_error']: IllegalJsonError | QuizValidationError;
};

export type QuizGeneratorView = Observable<QuizGeneratorViewEvents> & {
    clear(): void;
};

const validateQuizJson = makeValidator(quizSchema);

type SafeParseResult = [IllegalJsonError | QuizValidationError, null] | [null, QuizData];

const safeParseQuizJson = (jsonString: string): SafeParseResult => {
    const [parsingErr, parsed] = parseJsonObject(jsonString);

    if (parsingErr !== null) {
        return [parsingErr, null];
    }

    const [validationErr, quiz] = validateQuizJson(parsed);

    if (validationErr !== null) {
        return [validationErr, null];
    }

    return [null, quiz];
};

export const createQuizGeneratorView = (element: HTMLElement): QuizGeneratorView => {
    const ee = createEventEmitter<QuizGeneratorViewEvents>();

    const form = getFirstElementOrFail('.generator__form', element) as HTMLFormElement;
    const textarea = getFirstElementOrFail('#quiz-json-input', form) as HTMLTextAreaElement;

    const toValid = () => textarea.classList.remove('generator__textarea_error');
    const toInvalid = () => textarea.classList.add('generator__textarea_error');

    form.addEventListener('submit', event => {
        event.preventDefault();
        const [err, quiz] = safeParseQuizJson(textarea.value);

        if (err !== null) {
            toInvalid();
            return ee.emit('validation_error', err);
        }

        ee.emit('submit', { quiz });
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
