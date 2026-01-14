import type { Quiz } from '@/types/quiz';
import type { QuizCardView } from './view.types';
import { createQuizCardView } from './quiz-card.view';

type Deps = {
    quizCardTemplate: HTMLElement;
};

export const createQuizCardViewFactory = ({ quizCardTemplate }: Deps) =>
    (quiz: Quiz): QuizCardView => {
        const card = createQuizCardView({
            quizId: quiz.id,
            element: quizCardTemplate.cloneNode(true) as HTMLElement,
        });

        card.render(quiz);

        return card;
    };
