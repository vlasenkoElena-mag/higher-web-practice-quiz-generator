import type { GetQuizError } from '@/errors/get-quiz-error';
import type { GetQuizResult, Observable } from '@/types/base';
import type { OptionId, Question, QuestionOption, Quiz } from '@/types/quiz';
import { createEventEmitter } from '@/utils/event-emitter';
import { isNil } from '@/utils/utils';

export type OptionDetails = {
    message: string;
    isSuccess: boolean;
};

export type QuizResult = {
    correct: number;
    total: number;
};

export type QuizAnswerResult = {
    isCorrect: boolean;
    details: Map<OptionId, OptionDetails>;
};

export type QuizGameEvents = {
    ['quiz_getting_error']: GetQuizError;
    ['quiz_started']: { quiz: Quiz };
    ['question_ready']: {
        question: Question;
        currentIndex: number;
        total: number;
    };
    ['question_answered']: {
        question: Question;
        result: QuizAnswerResult;
        selectedOptionIds: Set<number>;
        isLast: boolean;
    };
    ['quiz_finished']: QuizResult;
};

export type QuizGameModel = {
    start: (getQuiz: () => Promise<GetQuizResult>) => void;
    addAnswer: (selectedOptionIds: Set<number>) => void;
    moveToNextQuestion: () => void;
    restart: () => void;
} & Observable<QuizGameEvents>;

type I = QuizGameModel;

export const createQuizGameModel = (): QuizGameModel => {
    let questionIndex = 0;
    let correctAnswers = 0;
    let done = false;
    let quiz: Quiz;

    const ee = createEventEmitter<QuizGameEvents>();

    const start: I['start'] = async (getQuiz): Promise<void> => {
        const [err, loadedQuiz]  = await getQuiz()

        if (err !== null) {
            return ee.emit('quiz_getting_error', err);
        }

        quiz = loadedQuiz;
        ee.emit('quiz_started', { quiz: loadedQuiz });
        publishQuestion();
    };

    const addAnswer: I['addAnswer'] = selectedOptionIds => {
        if (done) {
            return;
        };

        const question = quiz.questions[questionIndex];

        if (!question) {
            return;
        };

        const result = getResult(question, selectedOptionIds);

        if (result.isCorrect) {
            correctAnswers += 1;
        }

        const isLast = questionIndex >= quiz.questions.length - 1;
        ee.emit('question_answered', { question, selectedOptionIds, result, isLast });
    };

    const moveToNextQuestion: QuizGameModel['moveToNextQuestion'] = (): void => {
        if (done) {
            return;
        };

        const hasNext = questionIndex < quiz.questions.length - 1;

        if (!hasNext) {
            finish();
        }
        else {
            questionIndex += 1;
            publishQuestion();
        }
    };

    const restart: I['restart'] = (): void => {
        reset();
        publishQuestion();
    };

    const finish = (): void => {
        done = true;

        ee.emit('quiz_finished', {
            correct: correctAnswers,
            total: quiz.questions.length,
        });
    };

    const reset = (): void => {
        questionIndex = 0;
        correctAnswers = 0;
        done = false;
    };

    const publishQuestion = (): void => {
        const question = getCurrentQuestion();

        if (isNil(question)) {
            return;
        };

        ee.emit('question_ready', {
            question,
            currentIndex: questionIndex,
            total: quiz.questions.length,
        });
    };

    const getCurrentQuestion = (): Question | undefined =>
        quiz.questions[questionIndex];

    const getCorrectOptionIds = (question: Question): Set<number> => {
        return new Set(question.options.filter(it => it.correct).map(it => it.id));
    };

    const getResult = (question: Question, selectedOptionIds: Set<number>): QuizAnswerResult => {
        const correctIds = getCorrectOptionIds(question);

        const isCorrect = selectedOptionIds.size === correctIds.size
          && [...selectedOptionIds].every(id => correctIds.has(id));

        const resultOptions = question.options.filter(option => option.correct || selectedOptionIds.has(option.id));
        const details = new Map(resultOptions.map(option => [option.id, getDetails(option)]));

        return { isCorrect, details };
    };

    return {
        start,
        addAnswer,
        moveToNextQuestion,
        restart,
        on: ee.on,
    };
};

const getDetails = (option: QuestionOption): OptionDetails => ({
    message: option.message,
    isSuccess: option.correct,
});
