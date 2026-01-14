import type {
    ErrorView,
    QuizGameResultView,
    QuizHeaderView,
    QuizProgressView,
} from '../view/view.types';
import type { QuizSectionView } from '../view/quiz-section.view';
import type { QuestionView } from '../view/question.view';
import { formatResult } from './format-result-info';
import type { QuestionOptionsViewFactory } from './question-options-view.factory';
import type { Question } from '@/types/quiz';
import type { Initializer } from '@/types/base';
import type { QuizAnswerResult, QuizGameModel, QuizResult } from '../models/quiz-game.model';
import { QuizNotFoundError } from '@/errors/quiz-not-found';

type Deps = {
    model: QuizGameModel;
    quizSectionView: QuizSectionView;
    quizProgressView: QuizProgressView;
    questionView: QuestionView;
    quizGameResultView: QuizGameResultView;
    quizHeaderView: QuizHeaderView;
    errorView: ErrorView;
    questionOptionsViewFactory: QuestionOptionsViewFactory;
};

const QUESTION_URL_PARAM = 'question';

export const createQuizGamePresenter = (deps: Deps): Initializer => {
    const {
        quizSectionView,
        quizProgressView,
        questionView,
        quizGameResultView,
        quizHeaderView,
        model,
        questionOptionsViewFactory,
        errorView,
    } = deps;

    const init = (): void => {
        questionView.on('submit', ({ selectedOptionIds }) => {
            model.addAnswer(selectedOptionIds);
        });

        questionView.on('next_button_click', () => {
            model.moveToNextQuestion();
        });

        quizGameResultView.on('restart', () => {
            quizSectionView.show();
            model.restart();
        });

        model.on('quiz_started', ({ quiz: { title, description, questions } }) => {
            quizHeaderView.render({ title, description });
            quizProgressView.render({ currentIndex: 0, total: questions.length });
        });

        model.on(
            'question_ready',
            ({ question, currentIndex, total }) => {
                quizProgressView.render({ currentIndex, total });
                renderQuestion(question);
                setUrlQuestion(currentIndex);
            });

        model.on('question_answered', ({ question, result, selectedOptionIds, isLast }) => {
            renderAnsweredQuestion(question, selectedOptionIds, result, isLast);
        });

        model.on('quiz_finished', result => {
            quizSectionView.hide();
            renderResultInfo(result);
            removeUrlQuestion();
        });

        model.on('quiz_getting_error', err => {
            if (err instanceof QuizNotFoundError) {
                errorView.render({
                    message: 'Ошибка: Тест не найден.',
                    details: 'Возможно, вы ввели неверный идентификатор тест в строке URL.',
                });
            }
            else {
                errorView.render({
                    message: 'Ошибка: Не удалось загрузить тест.',
                    details: 'Произошла неизвестная ошибка при загрузке теста.',
                });
            }
        });
    };

    const setUrlQuestion = (index: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set(QUESTION_URL_PARAM, String(index + 1));
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    };

    const removeUrlQuestion = () => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete(QUESTION_URL_PARAM);
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.replaceState({}, '', newUrl);
    };

    const renderResultInfo = (result: QuizResult): void => {
        quizGameResultView.render(formatResult(result));
    };

    const renderQuestion = (question: Question) => {
        const questionOptionsView = questionOptionsViewFactory.makeQuestionOptionsView(question);

        questionView.renderQuestion({
            questionElement: questionOptionsView.element,
        });
    };

    const renderAnsweredQuestion = (
        question: Question,
        answer: Set<number>,
        result: QuizAnswerResult,
        isLast: boolean,
    ) => {
        const questionOptionsView = questionOptionsViewFactory.makeAnsweredQuestionOptionsView({
            question,
            selectedOptions: answer,
            details: result.details,
        });

        questionView.renderAnsweredQuestion({
            questionElement: questionOptionsView.element,
            nextButtonText: isLast ? 'Завершить тест' : 'Следующий вопрос',
        });
    };

    return { init };
};
