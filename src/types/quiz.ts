import type { z } from 'zod';
import type { quizSchema } from '@/schemas/quiz';

export type OptionId = number;
export type QuizId = string;

export type QuizData = z.infer<typeof quizSchema>;

export type Quiz = QuizData & {
    id: QuizId;
};

export type Question = Quiz['questions'][number];
export type QuestionOption = Question['options'][number];
