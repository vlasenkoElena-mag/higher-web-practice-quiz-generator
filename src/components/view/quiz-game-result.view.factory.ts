import type { ResultInfo } from '../presenters/types';
import { getFirstElementOrFail } from '@/utils/dom-utils';
import type { QuizGameResultView, QuizGameResultViewEvents } from './view.types';
import { createEventEmitter } from '@/utils/event-emitter';

type Deps = { element: HTMLElement };

export const createQuizGameResultView = ({ element }: Deps): QuizGameResultView => {
    const ee = createEventEmitter<QuizGameResultViewEvents>();

    const title = getFirstElementOrFail('.modal__title', element);
    const details = getFirstElementOrFail('.modal__subtitle', element);
    const summary = getFirstElementOrFail('.modal__message', element);
    const restartButton = getFirstElementOrFail('.modal__restart', element) as HTMLButtonElement;

    const show = () => {
        element.hidden = false;
        element.classList.add('modal--open');
    };

    const hide = () => {
        element.hidden = true;
        element.classList.remove('modal--open');
    };

    restartButton.addEventListener('click', () => {
        hide();
        ee.emit('restart', undefined);
    });

    const render = ({ title: t, details: d, summary: s }: ResultInfo) => {
        title.textContent = t;
        details.textContent = d;
        summary.textContent = s;

        show();
    };

    return { render, on: ee.on };
};
