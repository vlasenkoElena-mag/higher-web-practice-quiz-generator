import { type DBSchema, type IDBPDatabase, openDB } from 'idb';
import { v7 as uuidV7 } from 'uuid';
import { isNil } from './utils';
import { QuizNotFoundError } from '@/errors/quiz-not-found';
import { GetQuizError } from '@/errors/get-quiz-error';
import { AddQuizError } from '@/errors/add-auiz-error';
import { LoadQuizListError } from '@/errors/load-quiz-list-error';
import type { Quiz } from '@/types/quiz';
import type { QuizStorage as I } from '@/types/base';

const DB_NAME = 'quiz-generator';
const SCHEMA_NAME = 'quizzes';
const DB_VERSION = 1;

type Schema = {
    [SCHEMA_NAME]: { key: string; value: Quiz };
} & DBSchema;

const makeQuizStorage = (): I => {
    let db: IDBPDatabase<Schema> | null = null;

    const getDb = (): IDBPDatabase<Schema> => {
        if (isNil(db)) {
            throw new Error('Database not connected.');
        }

        return db;
    }

    const connect = async () => {
        db = await openDB<Schema>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(SCHEMA_NAME)) {
                    db.createObjectStore(SCHEMA_NAME, { keyPath: 'id' });
                }
            },
        });
    }

    const add: I['add']  = async quizData => {
        try {
            const quiz: Quiz = { id: uuidV7(), ...quizData };
            await getDb().put(SCHEMA_NAME, quiz);

            return [null, quiz];
        }
        catch (error) {
            return [new AddQuizError(error), null];
        }
    }

    const get: I['get'] = async id => {
        try {
            const quiz = await getDb().get(SCHEMA_NAME, id);
            return isNil(quiz) ? [new QuizNotFoundError(id), null] : [null, quiz];
        }
        catch (error) {
            return [new GetQuizError(error), null];
        }
    }

    const getAll: I['getAll'] = async () => {
        try {
            const quizzes = await getDb().getAll(SCHEMA_NAME);

            return [null, quizzes];
        }
        catch (error) {
            return [new LoadQuizListError(error), null];
        }
    }

    const clear: I['clear'] = async () => {
        try {
            await getDb().clear(SCHEMA_NAME);
        }
        catch (error) {
            throw new Error(`Failed to clear the database: ${error}`);
        }
    }

    return { connect, add, clear, getAll, get };
}

export const initDb = async () => {
    const storage = makeQuizStorage();
    await storage.connect();
    return storage;
};
