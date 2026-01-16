import type { Renderer } from '@/types/base';
import type { ErrorDescription } from '@/types/view';
import { getFirstElementOrFail } from '@/utils/dom-utils';

export const createErrorView = (element: HTMLElement): Renderer<ErrorDescription> => {
    const messageElement = getFirstElementOrFail('.toast__title', element);
    const detailsElement = getFirstElementOrFail('.toast__message', element);
    const hideButton = getFirstElementOrFail('.toast__action', element) as HTMLButtonElement;
    const overlayElement: HTMLElement | null = document.getElementById('toast-overlay');

    const show = () => {
        element.hidden = false;
        overlayElement?.classList.add('active');
        document.body.classList.add('toast-open');
    };

    const hide = () => {
        element.hidden = true;
        overlayElement?.classList.remove('active');
        document.body.classList.remove('toast-open');
    };

    const setDescription = ({ message, details }: ErrorDescription) => {
        messageElement.textContent = message;
        detailsElement.textContent = details;
    };

    hideButton.addEventListener('click', () => hide());

    return {
        render: (description: ErrorDescription) => {
            setDescription(description);
            show();
        },
    };
};
