import { getFirstElementOrFail } from '@/utils/dom-utils';
import { navigateTo } from '@/utils/location.utils';

export const initBurgerMenu = (): void => {
    const button = getFirstElementOrFail('.header__menu-button') as HTMLButtonElement;
    const menu = getFirstElementOrFail('.burger__menu');
    const icon = getFirstElementOrFail('.header__menu-icon') as HTMLImageElement;
    const dropdownTextElements = Array.from(document.querySelectorAll('.dropdown-text'));

    let isOpen = false;

    const updateView = (): void => {
        menu.classList.toggle('active', isOpen);
        document.documentElement.classList.toggle('menu-open', isOpen);
        document.body.classList.toggle('menu-open', isOpen);

        icon.src = isOpen ? './assets/cross.svg' : './assets/burger.svg';
        icon.alt = isOpen ? 'Закрыть меню' : 'Открыть меню';
    };

    const toggleMenu = (): void => {
        isOpen = !isOpen;
        updateView();
    };

    const closeMenu = (): void => {
        isOpen = false;
        updateView();
    };

    button.addEventListener('click', toggleMenu);

    dropdownTextElements.forEach(item => {
        item.addEventListener('click', () => item.textContent === 'Добавить квиз' ? navigateTo('./qiix.html') : navigateTo('./quizzes.html'));
    });

    document.addEventListener('click', (e: MouseEvent): void => {
        const target = e.target as Element;

        if (
            isOpen
            && !menu.contains(target)
            && !button.contains(target)
        ) {
            closeMenu();
        }
    });
};
