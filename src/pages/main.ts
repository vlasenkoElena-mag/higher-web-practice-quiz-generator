import { getFirstElementOrFail } from '@/utils/dom-utils';
import { initDb } from '@/utils/storage';
import { createErrorView } from '@/components/view/error-message.view.factory';
import { createQuizGeneratorView } from '@/components/view/quiz-generator.view.factory';
import {
    createQuizGeneratorPresenter,
} from '@/components/presenters/quiz-generator.presenter.factory';
import { createQuizzesModel } from '@/components/models/quizzes-mode.factory';

const db = await initDb();

const model = createQuizzesModel({ db });

const quizGeneratorPresenter = createQuizGeneratorPresenter({
    generatorView: createQuizGeneratorView(getFirstElementOrFail('.generator')),
    errorView: createErrorView(getFirstElementOrFail('#error-toast')),
    model,
});

quizGeneratorPresenter.init();
