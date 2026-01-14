import { getFirstElementOrFail, getTemplateFirstChild } from '../utils/dom-utils';
import { initDb } from '@/utils/storage';
import { createQuizzesView } from '@/components/view/quizzes.view.factory';
import { createQuizCardViewFactory } from '@/components/view/quiz-card-view.factory';
import { createQuizzesPresenter } from '@/components/presenters/quizzes.presenter.factory';
import { createQuizzesModel } from '@/components/models/quizzes-model.factory';
import { createErrorView } from '@/components/view/error-message.view.factory';

const db = await initDb();
const model = createQuizzesModel({ db });

const presenter = createQuizzesPresenter({
    createCardView: createQuizCardViewFactory({
        quizCardTemplate: getTemplateFirstChild('quiz-card-template'),
    }),
    quizzesView: createQuizzesView(),
    model,
    errorView: createErrorView(getFirstElementOrFail('#error-toast')),
});

presenter.init();
model.loadQuizzes();
