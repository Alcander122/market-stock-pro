import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  template: `
    @if (loadingService.isLoading()) {
      <div class="global-progress-bar">
        <div class="progress-bar-value"></div>
      </div>
    }
    <app-header></app-header> 
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent { 
  loadingService = inject(LoadingService);
}