import type { Quiz, QuizId } from '@/types/quiz';
import { getFirstElementOrFail } from '@/utils/dom-utils';
import type { QuizCardView, QuizCardViewEvents } from './view-types';
import { createEventEmitter } from '@/utils/event-emitter';

type Deps = {
    element: HTMLElement;
    quizId: QuizId;
};

export const createQuizCardView = ({ element, quizId }: Deps): QuizCardView => {
    const title = getFirstElementOrFail('.quiz-card__title', element);
    const description = getFirstElementOrFail('.quiz-card__description', element);
    const count = getFirstElementOrFail('.quiz-card__count', element);
    const action = getFirstElementOrFail('.quiz-card__action', element);
    const ee = createEventEmitter<QuizCardViewEvents>();

    action.addEventListener('click', event => {
        event.preventDefault();
        ee.emit('start_quiz_click', { quizId: quizId });
    });

    const renderTo = (container: HTMLElement | DocumentFragment): void => {
        container.appendChild(element);
    };

    const render = (quiz: Quiz): void => {
        quizId = quiz.id;
        title.textContent = quiz.title;
        description.textContent = quiz.description;
        const questionNumber = quiz.questions.length;
        count.textContent = `${questionNumber} ${getCountPostfix(questionNumber)}`;
    };

    const getCountPostfix = (n: number): string => {
        const lastDigit = parseInt(n.toString().at(-1) ?? '0', 10);

        return (
            lastDigit === 0 ? 'вопросов' :
            lastDigit === 1 ? 'вопрос' :
            lastDigit <= 4 ? 'вопроса' :
            'вопросов'
        );
    };

    return {
        render,
        renderTo,
        on: ee.on,
    };
};
