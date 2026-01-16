import { getFirstElementOrFail } from '@/utils/dom-utils';
import { initDb } from '@/utils/storage';
import { createErrorView } from '@/components/view/error-message-view';
import { createQuizGeneratorView } from '@/components/view/quiz-generator-view';
import {
    createQuizGeneratorPresenter,
} from '@/components/presenters/quiz-generator-presenter';
import { createQuizzesModel } from '@/components/models/quizzes-model';
import { initBurgerMenu } from '@/components/view/burger-menu-view';

const db = await initDb();

const model = createQuizzesModel({ db });

const quizGeneratorPresenter = createQuizGeneratorPresenter({
    generatorView: createQuizGeneratorView(getFirstElementOrFail('.generator')),
    errorView: createErrorView(getFirstElementOrFail('#error-toast')),
    model,
});

quizGeneratorPresenter.init();
initBurgerMenu();
