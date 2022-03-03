import { Component } from '@angular/core';
import { CategoryQuestionsCount } from 'src/app/models/category.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss']
})
export class DialogContentComponent {

  categoryQuestionsCount: CategoryQuestionsCount[] = [];

  constructor() {
    this.categoryQuestionsCount = ApiService.categoryQuestionsCount;
  }

  customNumberFormat(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
