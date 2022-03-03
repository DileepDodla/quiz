import { Component } from '@angular/core';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  fabButtonsRandom: MatFabMenu[] = [
    {
      id: 1,
      icon: 'home',
      color: "primary",
      tooltip: "Home",
      tooltipPosition: "left"
    },
    {
      id: 2,
      icon: "settings",
      color: "primary",
      tooltip: "Preferences",
      tooltipPosition: "left"
    },
    {
      id: 3,
      icon: 'insights',
      color: "primary",
      tooltip: "Performance Insights",
      tooltipPosition: "left"
    },
    {
      id: 4,
      icon: 'audiotrack',
      color: "primary",
      tooltip: "Music",
      tooltipPosition: "left"
    }
  ];
}
