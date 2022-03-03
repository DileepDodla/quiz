import { QuestionData } from "./question-data.model";

export interface QuizScore {
    questions: QuestionData[],
    userAnswers: string[]
}