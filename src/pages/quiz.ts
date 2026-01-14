import { initDb } from '@/utils/storage';
import { getFirstElementOrFail, getTemplateFirstChild } from '@/utils/dom-utils';
import { isNil } from '@/utils/utils';
import { getUrlParam, navigateTo } from '@/utils/location.utils';
import { QuestionOptionsViewFactory } from '@/components/presenters/question-options-view.factory';
import { createQuestionView } from '@/components/view/question.view';
import { createQuizSectionView } from '@/components/view/quiz-section.view';
import { createQuizGameResultView } from '@/components/view/quiz-game-result.view';
import { createQuizHeaderView } from '@/components/view/quiz-header.view';
import { createQuizProgressView } from '@/components/view/quiz-progress.view';
import { createQuizGamePresenter } from '@/components/presenters/quiz-game.presenter';
import { createQuizGameModel } from '@/components/models/quiz-game.model';
import { createErrorView } from '@/components/view/error-message.view';

const extractUrlQuizId = (): string => {
    const id = getUrlParam('id');

    if (isNil(id)) {
        navigateTo('./quizzes.html');
    }

    return id as string;
};

const quizId = extractUrlQuizId();

const quizSection = getFirstElementOrFail('.quiz');
const quizHeader = getFirstElementOrFail('.quiz__head', quizSection);
const quizProgress = getFirstElementOrFail('.quiz__progress', quizSection);
const quizContent = getFirstElementOrFail('.quiz__content', quizSection);
const model = createQuizGameModel();

const quizGamePresenter = createQuizGamePresenter({
    questionOptionsViewFactory: new QuestionOptionsViewFactory({
        singleQuestionTemplate: getTemplateFirstChild('single-question-template'),
        multipleQuestionTemplate: getTemplateFirstChild('multiple-question-template'),
        radioOptionTemplate: getTemplateFirstChild('option-template'),
        checkboxOptionTemplate: getTemplateFirstChild('checkbox-option-template'),
    }),
    quizSectionView: createQuizSectionView(quizSection),
    quizProgressView: createQuizProgressView(quizProgress),
    questionView: createQuestionView({ element: quizContent }),
    quizGameResultView: createQuizGameResultView({
        element: getFirstElementOrFail('#result-modal'),
    }),
    quizHeaderView: createQuizHeaderView(quizHeader),
    model,
    errorView: createErrorView(getFirstElementOrFail('#error-toast')),
});

quizGamePresenter.init();
const db = await initDb();
model.start(() => db.get(quizId));
