import type { QuizGettingError } from '@/errors/quiz-getting-error';
import type { QuizNotFoundError } from '@/errors/quiz-not-found';
import type { Either } from '@/utils/fp/tuple-based-either';
import type { Quiz, QuizData } from './quiz';
import type { QuizzesLoadingError } from '@/errors/quizzes-loading.error';
import type { QuizAddingError } from '@/errors/quiz-adding.error';

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

export type GetQuizResult = Either<QuizGettingError | QuizNotFoundError, Quiz>;
export type LoadQuizzesResult = Either<QuizzesLoadingError, Quiz[]>;
export type AddQuizResult = Either<QuizAddingError, Quiz>;

export type QuizStorage = {
    add(quiz: QuizData): Promise<AddQuizResult>;
    get(id: string): Promise<GetQuizResult>;
    getList(): Promise<LoadQuizzesResult>;
};
