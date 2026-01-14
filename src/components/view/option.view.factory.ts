import type { AnsweredOptionViewData, OptionViewData } from '@/types/view';
import { getFirstElementOrFail } from '@/utils/dom-utils';
import { isNil } from '@/utils/utils';
import type { OptionView } from './view.types';

export const createOptionView = (element: HTMLElement): OptionView => {
    const input = getFirstElementOrFail('.option__input', element) as HTMLInputElement;
    const label = getFirstElementOrFail('.option__label', element) as HTMLLabelElement;
    const text = getFirstElementOrFail('.option__text', element);
    const message = getFirstElementOrFail('.option__message', element);

    const setEmptyResult = () => {
        message.textContent = '';
        message.hidden = true;
    };

    const setResult = (result: Required<AnsweredOptionViewData>['result']) => {
        label.classList.remove('option__label--success', 'option__label--error');
        input.classList.remove('checkbox--success', 'checkbox--error', 'radio--success', 'radio--error');

        message.hidden = false;
        message.textContent = result.message;

        const modifier = result.ok ? 'success' : 'error';
        label.classList.add(`option__label--${modifier}`);

        if (input.classList.contains('checkbox')) {
            input.classList.add(`checkbox--${modifier}`);
        }
        else if (input.classList.contains('radio')) {
            input.classList.add(`radio--${modifier}`);
        }
    };

    const renderOptions = (data: OptionViewData) => {
        const { option } = data;

        input.value = String(option.id);
        input.disabled = false;
        input.checked = false;

        text.textContent = option.text;

        setEmptyResult();
    };

    const renderAnsweredOptions = (data: AnsweredOptionViewData) => {
        const { option, checked, result } = data;

        input.value = option.id.toString();
        input.disabled = !isNil(result);
        input.checked = checked;
        text.textContent = option.text;

        if (isNil(result)) {
            setEmptyResult();
        }
        else {
            setResult(result);
        }
    };

    return {
        element,
        renderOptions,
        renderAnsweredOptions,
    };
};
