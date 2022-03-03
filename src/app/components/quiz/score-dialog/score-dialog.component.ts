import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuizScore } from 'src/app/models/quiz-score.model';

@Component({
  selector: 'app-score-dialog',
  templateUrl: './score-dialog.component.html',
  styleUrls: ['./score-dialog.component.scss']
})
export class ScoreDialogComponent {

  score: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: QuizScore) {
    this.calculateScore(data);
  }

  calculateScore(data: QuizScore): void {
    let correctAnswers = data.questions.map(question => question.correct_answer);
    for (let i = 0; i < data.questions.length; i++) {
      if (data.userAnswers[i] == correctAnswers[i]) {
        this.score += 1;
      }
    }
  }

}
