import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';

import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiRequest } from 'src/app/models/api-request.model';
import { Router } from '@angular/router';
import { QuestionData } from 'src/app/models/question-data.model';

/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 200,
  touchendHideDelay: 200,
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }
  ],
})
export class HomeComponent implements OnInit {

  totalNumOfQuestions: number;
  quizPreferencesForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private dialog: MatDialog, private router: Router, private apiService: ApiService) {
    if (ApiService.categories.length == 0) {
      this.getCategories();
    }
    this.totalNumOfQuestions = ApiService.totalNumOfQuestions;
    this.quizPreferencesForm = this.fb.group({
      amount: ['10', [Validators.required, Validators.min, Validators.max]],
      category: [''],
      difficulty: [''],
      type: ['']
    });

    if (localStorage.getItem('userPreferences')) {
      this.quizPreferencesForm.setValue(JSON.parse(localStorage.getItem('userPreferences') || '{}'));
    }
  }

  ngOnInit() { }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentComponent, { panelClass: ["dialog-content"] });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  getCategories(): void {
    this.apiService.getCategories().subscribe(
      data => {
        ApiService.categories = data;
        this.getCategoriesGlobalCount();
      },
      (err: HttpErrorResponse) => {
        console.error(err);
      }
    )
  }

  getCategoriesGlobalCount(): void {
    this.apiService.getCategoriesGlobalCount().subscribe(
      data => {
        ApiService.totalNumOfQuestions = data["overall"]["total_num_of_questions"];
        for (let category of ApiService.categories) {
          ApiService.categoryQuestionsCount.push({
            name: category.name,
            count: data["categories"][category.id]["total_num_of_questions"]
          });
          ApiService.categoryQuestionsCount.sort((a, b) => (b.count > a.count) ? 1 : -1);
          this.totalNumOfQuestions = ApiService.totalNumOfQuestions;
        }
      },
      (err: HttpErrorResponse) => {
        console.error(err);
      }
    )
  }

  categories() {
    return ApiService.categories.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }

  onSavePreferences(): void {
    if (this.quizPreferencesForm.valid) {
      localStorage.setItem('userPreferences', JSON.stringify(this.quizPreferencesForm.value));
      this.snackBar.open("✔ Saved preferences successfully!", "", { duration: 3000, panelClass: ['bg-success', 'text-light'] });
    }
    else {
      this.quizPreferencesForm.markAllAsTouched();
    }
  }

  onQuizPreferencesFormSubmit(): void {
    if (this.quizPreferencesForm.valid) {

      // Create params
      let params = { ...this.quizPreferencesForm.value };
      for (let [key, value] of Object.entries(params)) {
        if (value === "")
          delete params[key];
      }

      this.startQuizSession(params);
    }
    else {
      this.quizPreferencesForm.markAllAsTouched();
    }
  }

  private getSessionToken(): void {
    this.apiService.getSessionToken().subscribe(
      data => {
        localStorage.setItem('sessionToken', data.token);
      },
      (err: HttpErrorResponse) => {
        console.error(err);
      }
    )
  }

  private startQuizSession(params: ApiRequest) {
    if (!localStorage.getItem('sessionToken')) {
      this.getSessionToken();
    }
    else {
      params.encode = "base64";
      params.token = localStorage.getItem('sessionToken') || "";
      this.apiService.getQuizData(params).subscribe(
        data => {
          let responseCode = data["response_code"];
          console.log(responseCode);
          switch (responseCode) {
            case 0: {
              ApiService.questionsData = data["results"] as QuestionData[];
              this.router.navigate(['/start']);
              break;
            }
            case 1: {
              // Without token
              this.snackBar.open("Oopsie! The database doesn't have any more unique questions for the selected preferences. Start again to get the old questions.", "", { duration: 6000, panelClass: ['bg-info', 'text-dark'] });
              break;
            }
            case 2: {
              console.error("Invalid request parameters");
              break;
            }
            case 3: {
              console.error("Invalid session token");
              this.getSessionToken();
              this.startQuizSession(params);
              break;
            }
            case 4: {
              // With token
              this.snackBar.open("Oopsie! The database doesn't have any more unique questions for the selected preferences. Start again to get the old questions.", "", { duration: 6000, panelClass: ['bg-info', 'text-dark'] });
              this.apiService.resetSessionToken(params.token || "").subscribe(
                res => {
                  if (res.code === 0) {
                    console.log("Token resetted");
                  }
                },
                (err: HttpErrorResponse) => {
                  console.error(err);
                }
              );
              break;
            }
          }
        },
        (err: HttpErrorResponse) => {
          console.error(err);
        }
      );
    }
  }

  customNumberFormat(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

