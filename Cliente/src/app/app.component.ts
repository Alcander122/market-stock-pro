import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component'; // 👈 Ajusta la ruta a tu archivo
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  template: `
    <app-header></app-header> 
    <main>
      <router-outlet></router-outlet>
    </main>
  ` // 
})
export class AppComponent { }