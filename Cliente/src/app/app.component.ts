import { Component } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent], // Importas tu nuevo componente aquí
  template: `
    <app-dashboard></app-dashboard>
  `
})
export class AppComponent { }