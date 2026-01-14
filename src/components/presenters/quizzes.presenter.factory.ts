import type { ErrorView, QuizCardFactory, QuizzesView } from '../view/view.types';
import type { Initializer } from '@/types/base';
import type { QuizzesModel } from '../models/quizzes-model.factory';

type Deps = {
    quizzesView: QuizzesView;
    errorView: ErrorView;
    model: QuizzesModel;
    createCardView: QuizCardFactory;
};

export const createQuizzesPresenter = (deps: Deps): Initializer => {
    const { model, quizzesView, errorView, createCardView } = deps;

    const init = () => {
        model.on('quizzes_loaded', ({ quizzes }) => {
            const cards = quizzes.map(createCardView);
            quizzesView.render(cards);
        });

        model.on('quizzes_loading_error', () => {
            quizzesView.clear();
            errorView.render({
                message: 'Ошибка: Не удалось загрузить квизы.',
                details: 'Произошла неизвестная ошибка при загрузке квизов.', // TODO: add real error handling
            });
        });

        quizzesView.on('start_quiz_click', ({ quizId }) => {
            window.location.href = `./quiz.html?id=${quizId}`;
        });

        model.loadQuizzes();
    };

    return { init };
};
