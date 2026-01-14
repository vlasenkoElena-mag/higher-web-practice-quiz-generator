export type QuizSectionView = {
    show(): void;
    hide(): void;
};

export const createQuizSectionView = (element: HTMLElement): QuizSectionView => {
    const show = () => {
        element.style.display = 'block';
    };

    const hide = () => {
        element.style.display = 'none';
    };

    return { show, hide };
};
