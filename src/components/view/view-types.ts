import type { Quiz, QuizId } from '@/types/quiz';
import type { Observable, Renderable, Renderer } from '@/types/base';
import type {
    AnsweredOptionViewData,
    ErrorDescription,
    OptionViewData,
    Progress,
    QuestionOptionsData,
    QuizHeadViewData,
} from '@/types/view';

export type QuizCardViewEvents = {
    ['start_quiz_click']: { quizId: QuizId };
};

export type QuizCardView = Observable<QuizCardViewEvents>
  & Renderable
  & Renderer<Quiz>;

export type QuizzesView = Observable<QuizCardViewEvents>
  & Renderer<QuizCardView[]>
  & { clear(): void };

export type QuizGameResultViewEvents = {
    ['restart']: undefined;
};

export type QuizGameResultView = Renderer<ResultInfo> & Observable<QuizGameResultViewEvents>;

export type QuizCardFactory = (quiz: Quiz) => QuizCardView;

export type OptionsView = Renderer<QuestionOptionsData> & {
    readonly element: HTMLElement;
};

export type OptionView = {
    readonly element: HTMLElement;
    renderOptions(data: OptionViewData): void;
    renderAnsweredOptions(data: AnsweredOptionViewData): void;
};

export type ErrorView = Renderer<ErrorDescription>;

export type QuizHeaderView = Renderer<QuizHeadViewData>;

export type QuizProgressView = Renderer<Progress>;

export type ResultInfo = {
    title: string;
    details: string;
    summary: string;
};
