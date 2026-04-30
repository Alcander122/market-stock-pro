import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
// Asegúrate de crear el componente Home primero (ng g c components/home)
import { Home as HomeComponent } from './features/home/home';

export const routes: Routes = [
    { path: '', component: HomeComponent },         // Ruta inicial: Catálogo
    { path: 'admin', component: DashboardComponent }, // Ruta admin: Gestión
    { path: '**', redirectTo: '' }                  // Comodín: si no existe, va al Home
];