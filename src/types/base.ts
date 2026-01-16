import type { GetQuizError } from '@/errors/get-quiz-error';
import type { QuizNotFoundError } from '@/errors/quiz-not-found';
import type { Quiz, QuizData } from './quiz';
import type { LoadQuizListError } from '@/errors/load-quiz-list-error';
import type { AddQuizError } from '@/errors/add-auiz-error';

export type EventName<T extends object> = keyof T;

export type Handler<T extends object, K extends keyof T = keyof T>
    = (payload: T[K]) => void;

export type Observable<T extends object> = {
    on<K extends EventName<T>>(eventName: K | K[], handler: Handler<T, K>): void;
};

export type Initializer = {
    init(): void;
};

export type Renderer<T> = {
    render(data?: T): void;
};

export type Renderable = {
    renderTo(container: HTMLElement | DocumentFragment): void;
};

export type EventBus<Messages extends object> = {
    /** Публикует событие */
    emit<T extends keyof Messages>(eventName: T, payload: Messages[T]): void;
    /** Добавляет обработчик события */
    on<T extends keyof Messages>(eventName: T | T[], handler: Handler<Messages, T>): void;
    /** Снимает обработчик события */
    off<T extends keyof Messages>(eventName: T, handler: Handler<Messages, T>): void;
    /** Добавляет обработчик любого события */
    onAll(handler: Handler<Messages>): void;
    /** Сбрасывает все обработчики */
    reset(): void;
};

export type GetQuizResult = [GetQuizError | QuizNotFoundError, null] | [null, Quiz];
export type LoadQuizzesResult = [LoadQuizListError, null] | [null, Quiz[]];
export type AddQuizResult = [AddQuizError, null] | [null, Quiz];

export type QuizStorage = {
    connect(): Promise<void>;
    add(quiz: QuizData): Promise<AddQuizResult>;
    get(id: string): Promise<GetQuizResult>;
    getAll(): Promise<LoadQuizzesResult>;
    clear(): Promise<void>;
};
