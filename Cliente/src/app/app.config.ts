import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Esto ELIMINA el error NG0908 de raíz
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient()
  ]
};