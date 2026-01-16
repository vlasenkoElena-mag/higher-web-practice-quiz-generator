import type { QuestionOption, Question } from './quiz';

export type ErrorDescription = {
    message: string;
    details: string;
};

export type OptionViewData = {
    option: QuestionOption;
};

export type AnsweredOptionViewData = OptionViewData & {
    option: QuestionOption;
    checked: boolean;
    result?: {
        message: string;
        isSuccess: boolean;
    };
};

export type QuestionOptionsData = {
    text: string;
    optionElements: HTMLElement[];
};

export type QuizHeadViewData = {
    title: string;
    description: string;
};

export type Progress = {
    currentIndex: number;
    total: number;
};

export type ModalViewData = {
    data?: {
        title: string;
        subtitle: string;
        message: string;
    };
    isOpen: boolean;
};

export type HeaderViewData = {
    isOpen?: boolean;
};
