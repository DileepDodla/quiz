import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionData } from 'src/app/models/question-data.model';
import { ApiService } from 'src/app/services/api.service';
import { Subscription, timer } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { ScoreDialogComponent } from './score-dialog/score-dialog.component';
import { QuizScore } from 'src/app/models/quiz-score.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {

  questionsData: QuestionData[];
  currentQuestion: QuestionData;
  currentQuestionNo: number;
  currentQuestionOptions: string[];

  selectedOption: string;
  allSelectedOptions: string[];

  timerValue: number = 0;
  progressTimer: Subscription;

  constructor(private dialog: MatDialog, private router: Router) {
    this.questionsData = ApiService.questionsData;
    if (!this.questionsData) {
      this.router.navigate(['/home']);
    }
    this.currentQuestion = this.questionsData[0];
    this.currentQuestionNo = 0;
    this.currentQuestionOptions = [];
    this.selectedOption = "";
    this.allSelectedOptions = [];
    this.progressTimer = new Subscription();

    this.loadNextQuestion();
  }

  openScoreDialog(score: QuizScore) {
    const dialogRef = this.dialog.open(ScoreDialogComponent, { data: score, panelClass: ["score-dialog"] });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/home']);
    });
  }

  observableTimer() {
    const source = timer(500, 100);
    this.progressTimer = source.subscribe(val => {
      // console.log(val, '-');
      this.timerValue = (val * 100 / 1000) * 5;
      if (val === 200) {
        this.loadNextQuestion();
      }
    });
  }

  decode(text: string): string {
    return atob(text);
  }

  onOptionSelected(): void {
    console.log(this.selectedOption);
  }

  loadNextQuestion(): void {
    this.allSelectedOptions.push(this.selectedOption);
    this.progressTimer.unsubscribe();
    this.timerValue = 0;
    if (this.currentQuestionNo < this.questionsData.length) {
      this.currentQuestionNo += 1;
      this.currentQuestion = this.questionsData[this.currentQuestionNo - 1];
      this.currentQuestionOptions = this.currentQuestion.incorrect_answers;
      this.currentQuestionOptions.push(this.currentQuestion.correct_answer);
      this.currentQuestionOptions = this.currentQuestionOptions.sort(() => Math.random() - 0.5);
      this.selectedOption = "";
      this.observableTimer();
      console.log(this.allSelectedOptions);
    }
    else {
      this.onQuizSubmit();
    }
  }

  onQuizSubmit(): void {
    let userAnswers = this.allSelectedOptions.slice(1);
    this.openScoreDialog({ questions: this.questionsData, userAnswers: userAnswers });
  }

}
