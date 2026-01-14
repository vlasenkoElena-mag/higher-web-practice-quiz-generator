import type { Initializer } from '@/types/base';
import type { ErrorView } from '../view/view.types';
import type { QuizGeneratorView } from '../view/quiz-generator.view';
import type { QuizzesModel } from '../models/quizzes-model';
import { JsonParsingError } from '@/errors/json-parsing.error';
import { navigateTo } from '@/utils/location.utils';

export type Deps = {
    model: QuizzesModel;
    generatorView: QuizGeneratorView;
    errorView: ErrorView;
};

export const createQuizGeneratorPresenter = (deps: Deps): Initializer => {
    const { generatorView, errorView, model } = deps;

    const init = () => {
        generatorView.on('submit', ({ quiz }) => model.add(quiz));

        generatorView.on('validation_error', err => {
            const message = err instanceof JsonParsingError
                ? 'Ошибка: не удалось обработать JSON.'
                : 'Ошибка: JSON-строка не соответствует схеме.';
                
            errorView.render({
                message,
                details: 'Проверьте формат данных и попробуйте снова.',
            });
        });

        model.on('quiz_added', async () => {
            generatorView.clear();
            navigateTo('./quizzes.html');
        });

        model.on('quiz_adding_error', () => {
            errorView.render({
                message: 'Ошибка: Не удалось сохранить тест.',
                details: 'Произошла ошибка при сохранении в базу данных.',
            });
        });
    };

    return { init };
};
