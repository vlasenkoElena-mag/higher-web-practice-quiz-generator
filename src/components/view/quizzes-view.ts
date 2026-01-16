import { getFirstElementOrFail, getTemplateFirstChild } from '@/utils/dom-utils';
import type { QuizCardView, QuizCardViewEvents, QuizzesView } from './view-types';
import { createEventEmitter } from '@/utils/event-emitter';

export const createQuizzesView = (): QuizzesView => {
    const ee = createEventEmitter<QuizCardViewEvents>();

    const element = getFirstElementOrFail('.quizzes');
    const cardsContainerOrigin = getTemplateFirstChild('quiz-list-template');
    const emptyContentOrigin = getTemplateFirstChild('empty-quiz-list-template');

    const renderCards = (cards: QuizCardView[]) => {
        const cardsContent = cardsContainerOrigin.cloneNode(true) as DocumentFragment;
        const cardsContainer = getFirstElementOrFail('.quizzes__list', cardsContent);
        cards.forEach(card => card.renderTo(cardsContainer));

        element.replaceChildren(cardsContent);

        cards.forEach(it => it.on(
            'start_quiz_click',
            payload => ee.emit('start_quiz_click', payload),
        ));
    };

    const renderEmptyContent = () => {
        const emptyContent = emptyContentOrigin.cloneNode(true) as HTMLElement;
        element.replaceChildren(emptyContent);
    };

    const render = (cards: QuizCardView[]) => {
        if (cards.length < 1) {
            return renderEmptyContent();
        }

        renderCards(cards);
    };

    const clear = () => renderEmptyContent();

    return { render, clear, on: ee.on };
};
