import { z } from 'zod';

export const quizOptionSchema = z.object({
    id: z.number(),
    text: z.string().nonempty(),
    correct: z.boolean(),
    message: z.string().nonempty(),
});

export const quizQuestionSchema = z.object({
    id: z.number(),
    text: z.string().nonempty(),
    type: z.enum(['single', 'multiple']),
    options: z.array(quizOptionSchema).min(2),
});

export const quizSchema = z.object({
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    questions: z.array(quizQuestionSchema).min(1),
});
