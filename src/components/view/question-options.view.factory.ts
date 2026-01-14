import type { QuestionOptionsData } from '@/types/view';
import { getFirstElementOrFail } from '@/utils/dom-utils';
import type { QuestionOptionsView } from './view.types';

export const createQuestionOptionsView = (element: HTMLElement): QuestionOptionsView => {
    const questionText = getFirstElementOrFail('.question__text', element);
    const optionsContainer = getFirstElementOrFail('.question__options', element);

    const render = (data: QuestionOptionsData) => {
        questionText.textContent = data.text;
        optionsContainer.replaceChildren(...data.optionElements);
    };

    return { element, render };
};
