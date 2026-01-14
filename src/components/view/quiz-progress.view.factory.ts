import type { Renderer } from '@/types/base';
import type { Progress } from '@/types/view';
import { getFirstElementOrFail } from '@/utils/dom-utils';

export const createQuizProgressView = (element: HTMLElement): Renderer<Progress> => {
    const progressText = getFirstElementOrFail('.quiz__progress-text', element);
    const progressBar = getFirstElementOrFail('.quiz__progress-bar', element) as HTMLProgressElement;

    const render = ({ total, currentIndex }: Progress) => {
        progressBar.max = total;
        progressBar.value = currentIndex + 1;
        progressText.textContent = `Вопрос ${currentIndex + 1} из ${total}`;
    };

    return { render };
};
