import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stats-card',
    template: `
    <div class="card">
      <h4>{{ titulo }}</h4>
      <p>{{ valor }}</p>
    </div>
  `,
    styles: [`
    .card {
      background: white;
      padding: 15px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
  `]
})
export class StatsCardComponent {
    @Input() titulo!: string;
    @Input() valor!: number | string;
}