import { v7 as uuidV7 } from 'uuid';
import { Either } from '@/utils/fp/tuple-based-either';
import { QuizAddingError } from '@/errors/quiz-adding.error';
import type { Observable, QuizStorage } from '@/types/base';
import type { Quiz, QuizData } from '@/types/quiz';
import type { QuizzesLoadingError } from '@/errors/quizzes-loading.error';
import { createEventEmitter } from '@/utils/event-emitter';

export type EventsMap = {
    ['quizzes_loaded']: { quizzes: Quiz[] };
    ['quiz_added']: { quiz: Quiz };
    ['quiz_adding_error']: QuizAddingError;
    ['quizzes_loading_error']: QuizzesLoadingError;
};

export type QuizzesModel = Observable<EventsMap> & {
    add(quizData: QuizData): Promise<void>;
    loadQuizzes(): Promise<void>;
};

export type QuizzesModelDeps = {
    db: QuizStorage;
};

export const createQuizzesModel = ({ db }: QuizzesModelDeps): QuizzesModel => {
    const ee = createEventEmitter<EventsMap>();
    
    const add: QuizzesModel['add'] = async quizData => {
        try {
            const quiz = { id: uuidV7(), ...quizData };
            await db.add(quiz);
            ee.emit('quiz_added', { quiz });
        }
        catch (error) {
            ee.emit('quiz_adding_error', new QuizAddingError(error));
        }
    };

    const loadQuizzes: QuizzesModel['loadQuizzes'] = async (): Promise<void> => {
        await db.getList().then(Either.match(
            err => ee.emit('quizzes_loading_error', err),
            quizzes => ee.emit('quizzes_loaded', { quizzes }),
        ));
    };

    return { add, loadQuizzes, on: ee.on };
};
