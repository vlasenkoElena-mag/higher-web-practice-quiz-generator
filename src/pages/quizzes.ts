import { getFirstElementOrFail, getTemplateFirstChild } from '../utils/dom-utils';
import { initDb } from '@/utils/storage';
import { createQuizzesView } from '@/components/view/quizzes.view.factory';
import { createQuizCardViewFactory } from '@/components/view/create-quiz-card-view';
import { createQuizzesPresenter } from '@/components/presenters/quizzes.presenter';
import { createQuizzesModel } from '@/components/models/quizzes-model';
import { createErrorView } from '@/components/view/error-message.view';

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
