import type { Question } from '@/types/quiz';
import type { OptionView, OptionsView } from './view.types';
import { createOptionView } from './option.view';
import type { QuestionOptionsData } from '@/types/view';
import { getFirstElementOrFail } from '@/utils/dom-utils';
import type { QuizAnswerResult } from '../models/quiz-game.model';

type Deps = {
    singleQuestionTemplate: HTMLElement;
    multipleQuestionTemplate: HTMLElement;
    radioOptionTemplate: HTMLElement;
    checkboxOptionTemplate: HTMLElement;
};

type MarkedOptionData = {
    question: Question;
    selectedOptions: Set<number>;
    details: QuizAnswerResult['details'];
}

export type OptionsViewFactory = {
    createOptionsView(question: Question): OptionsView ;
    createMarkedOptionsView(params: MarkedOptionData): OptionsView;
}

type I = OptionsViewFactory;

export const createOptionsViewFactory = ({
        singleQuestionTemplate,
        multipleQuestionTemplate,
        radioOptionTemplate,
        checkboxOptionTemplate,
    }: Deps): OptionsViewFactory => {

    const createOptionsView: I['createOptionsView'] = question => makeQuestionOptionView({
        question,
        optionViews: makeOptionViews(question),
    })

    const createMarkedOptionsView: I['createMarkedOptionsView'] = params => {
        const { question, selectedOptions, details } = params;

        return makeQuestionOptionView({
            question,
            optionViews: createAnsweredOptionViews({ question, selectedOptions, details }),
        });
    }

    const makeQuestionOptionView = ({ question, optionViews }: { question: Question; optionViews: OptionView[] }): OptionsView => {
        const { type, text } = question;
        const questionElement = getQuestionElement(type);
        const questionView = createQuestionOptionsView(questionElement);
        questionView.render({ optionElements: optionViews.map(it => it.element), text });

        return questionView;
    }

    const getQuestionElement = (questionType: Question['type']): HTMLElement => questionType === 'single'
        ? singleQuestionTemplate.cloneNode(true) as HTMLElement
        : multipleQuestionTemplate.cloneNode(true) as HTMLElement

    const getOptionElement = (questionType: Question['type']): HTMLElement => questionType === 'single'
        ? radioOptionTemplate.cloneNode(true) as HTMLElement
        : checkboxOptionTemplate.cloneNode(true) as HTMLElement

    const makeOptionViews = ({ options, type }: Question): OptionView[] => {
        const optionElement = getOptionElement(type);

        return options.map(option => {
            const optionView = createOptionView(optionElement.cloneNode(true) as HTMLElement);
            optionView.renderOptions({ option });

            return optionView;
        });
    }

    const createAnsweredOptionViews = ({ question: { options, type }, selectedOptions, details }: {
        question: Question;
        selectedOptions: Set<number>;
        details: QuizAnswerResult['details'];
    }): OptionView[] => {
        const optionElement = getOptionElement(type);

        return options.map(option => {
            const optionView = createOptionView(optionElement.cloneNode(true) as HTMLElement);

            optionView.renderAnsweredOptions({
                option,
                checked: selectedOptions.has(option.id),
                result: details.get(option.id),
            });

            return optionView;
        });
    }

    return { createOptionsView, createMarkedOptionsView }
} 

const createQuestionOptionsView = (element: HTMLElement): OptionsView => {
    const questionText = getFirstElementOrFail('.question__text', element);
    const optionsContainer = getFirstElementOrFail('.question__options', element);

    const render = (data: QuestionOptionsData): void => {
        questionText.textContent = data.text;
        optionsContainer.replaceChildren(...data.optionElements);
    };

    return { element, render };
};
