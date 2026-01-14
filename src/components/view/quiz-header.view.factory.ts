import type { Renderer } from '@/types/base';
import type { QuizHeadViewData } from '@/types/view';
import { getFirstElementOrFail } from '@/utils/dom-utils';

export const createQuizHeaderView = (element: HTMLElement): Renderer<QuizHeadViewData> => {
    const title = getFirstElementOrFail('.quiz__title', element);
    const description = getFirstElementOrFail('.quiz__description', element);

    const render = (data: QuizHeadViewData) => {
        title.textContent = data.title;
        description.textContent = data.description;
    };

    return { render };
};
