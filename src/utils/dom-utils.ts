import { assert, isNil } from './utils';

export const getFirstElementOrFail = (
    selector: string,
    containerElement: ParentNode = document,
): HTMLElement => {
    const element = containerElement.querySelector(selector);
    assert(!isNil(element), `Element not found. Selector: ${selector}`);
    assert(element instanceof HTMLElement, `Element is not an HTMLElement. Selector: ${selector}`);

    return element as HTMLElement;
};

export function getTemplateFirstChild<T extends HTMLElement = HTMLElement>(templateId: string): T {
    const template = getTemplate(templateId);

    return (template.content.firstElementChild as T);
}

export function getTemplate(templateId: string): HTMLTemplateElement {
    const template = document.getElementById(templateId);
    assert(!isNil(template), `Template not found. templateId: ${templateId}`);
    assert(template instanceof HTMLTemplateElement, `Element is not a template. templateId: ${templateId}`);

    return template as HTMLTemplateElement;
}

export function cloneTemplate<T extends HTMLElement = HTMLElement>(templateId: string): T {
    const firstChild = getTemplateFirstChild(templateId);

    return firstChild.cloneNode(true) as T;
}
