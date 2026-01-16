import { AddQuizError } from '@/errors/add-auiz-error';
import type { Observable, QuizStorage } from '@/types/base';
import type { Quiz, QuizData } from '@/types/quiz';
import type { LoadQuizListError } from '@/errors/load-quiz-list-error';
import { createEventEmitter } from '@/utils/event-emitter';
import { nanoid } from 'nanoid';

export type EventsMap = {
    ['quizzes_loaded']: { quizzes: Quiz[] };
    ['quiz_added']: { quiz: Quiz };
    ['quiz_adding_error']: AddQuizError;
    ['quizzes_loading_error']: LoadQuizListError;
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
            const quiz = { id: nanoid(), ...quizData };
            await db.add(quiz);
            ee.emit('quiz_added', { quiz });
        }
        catch (error) {
            ee.emit('quiz_adding_error', new AddQuizError(error));
        }
    };

    const loadQuizzes: QuizzesModel['loadQuizzes'] = async (): Promise<void> => {
        const [err, quizzes] = await db.getAll();

        if (err !== null) {
            return ee.emit('quizzes_loading_error', err);
        }

        ee.emit('quizzes_loaded', { quizzes });
    };

    return { add, loadQuizzes, on: ee.on };
};
