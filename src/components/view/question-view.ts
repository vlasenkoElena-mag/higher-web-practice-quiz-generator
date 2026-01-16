import { getFirstElementOrFail } from '@/utils/dom-utils';
import { createEventEmitter } from '@/utils/event-emitter';
import type { Observable } from '@/types/base';

export type QuestionData = {
    questionElement: HTMLElement;
};

export type QuestionViewEvents = {
    ['submit']: { selectedOptionIds: Set<number>; };
    ['next_button_click']: undefined;
};

export type QuestionView = Observable<QuestionViewEvents> & {
    renderQuestion(data: QuestionData): void;
    renderAnsweredQuestion(data: QuestionData & { nextButtonText: string }): void;
};

type Deps = { element: HTMLElement };

export const createQuestionView = ({ element }: Deps): QuestionView => {
    const ee = createEventEmitter<QuestionViewEvents>();

    const questionContainer = getFirstElementOrFail('.quiz__question', element);
    const form = getFirstElementOrFail('.quiz__form', element) as HTMLFormElement;
    const submitButton = getFirstElementOrFail('.quiz__submit', element) as HTMLButtonElement;
    const nextButton = getFirstElementOrFail('.quiz__next', element) as HTMLButtonElement;

    form.addEventListener('submit', event => {
        event.preventDefault();
        ee.emit('submit', { selectedOptionIds: extractSelectedOptionIds() });
    });

    nextButton.addEventListener('click', () => {
        ee.emit('next_button_click', undefined);
    });

    const extractSelectedOptionIds = (): Set<number> => {
        const optionIds = new FormData(form)
            .getAll('question')
            .map(it => it.toString())
            .map(it => parseInt(it, 10));

        return new Set(optionIds);
    };

    const renderQuestion: QuestionView['renderQuestion'] = ({ questionElement }) => {
        questionContainer.replaceChildren(questionElement);
        submitButton.hidden = false;
        nextButton.hidden = true;
        form.reset();
    };

    const disableFormInputs = (): void => {
        Array.from(form.elements).forEach(element => {
            if (element instanceof HTMLInputElement) {
                element.disabled = true;
            }
        });
    }

    const renderAnsweredQuestion: QuestionView['renderAnsweredQuestion'] = ({ questionElement, nextButtonText }) => {
        questionContainer.replaceChildren(questionElement);
        submitButton.hidden = true;
        nextButton.hidden = false;
        nextButton.textContent = nextButtonText;
        disableFormInputs();
    };

    return {
        renderQuestion,
        renderAnsweredQuestion,
        on: ee.on,
    };
};
