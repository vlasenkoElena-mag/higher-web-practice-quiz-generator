import { type DBSchema, type IDBPDatabase, openDB } from 'idb';
import { v7 as uuidV7 } from 'uuid';
import { isNil } from './utils';
import { Either } from './fp/tuple-based-either';
import { makeNotFoundResult } from '@/errors/quiz-not-found';
import { makeQuizGettingErrorResult } from '@/errors/quiz-getting-error';
import { makeQuizAddingErrorResult } from '@/errors/quiz-adding.error';
import { makeQuizzesLoadingErrorResult } from '@/errors/quizzes-loading.error';
import type { Quiz, QuizData } from '@/types/quiz';
import type { AddQuizResult, GetQuizResult, LoadQuizzesResult, QuizStorage } from '@/types/base';

const DB_NAME = 'quiz-generator';
const SCHEMA_NAME = 'quizzes';
const DB_VERSION = 1;

type Schema = {
    [SCHEMA_NAME]: { key: string; value: Quiz };
} & DBSchema;

class QuizIndexedDbStorage implements QuizStorage {
    #dao: IDBPDatabase<Schema> | null;

    constructor() {
        this.#dao = null;
    }

    get #db(): IDBPDatabase<Schema> {
        if (isNil(this.#dao)) {
            throw new Error('Database not initialized. Call init() before using the storage.');
        }

        return this.#dao;
    }

    async init() {
        const dao = await openDB<Schema>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(SCHEMA_NAME)) {
                    db.createObjectStore(SCHEMA_NAME, { keyPath: 'id' });
                }
            },
        });

        this.#dao = dao;
    }

    async add(quizData: QuizData): Promise<AddQuizResult> {
        try {
            const quiz: Quiz = { id: uuidV7(), ...quizData };
            await this.#db.put(SCHEMA_NAME, quiz);

            return Either.right(quiz);
        }
        catch (error) {
            return makeQuizAddingErrorResult(error);
        }
    }

    async get(id: string): Promise<GetQuizResult> {
        try {
            const quiz = await this.#db.get(SCHEMA_NAME, id);
            return isNil(quiz) ? makeNotFoundResult(id) : Either.right(quiz as Quiz);
        }
        catch (error) {
            return makeQuizGettingErrorResult(error);
        }
    }

    async getList(): Promise<LoadQuizzesResult> {
        try {
            const quizzes = await this.#db.getAll(SCHEMA_NAME);

            return Either.right(quizzes);
        }
        catch (error) {
            return makeQuizzesLoadingErrorResult(error);
        }
    }

        async clear(): Promise<void> {
        try {
            await this.#db.clear(SCHEMA_NAME);
        }
        catch (error) {
            throw new Error(`Failed to clear the database: ${error}`);
        }
    }
}

export const initDb = async () => {
    const storage = new QuizIndexedDbStorage();
    await storage.init();
    return storage;
};
