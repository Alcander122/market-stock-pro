import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { Home as HomeComponent } from './features/home/home';

export const routes: Routes = [

    // 🏠 HOME
    { path: '', component: HomeComponent },

    // 🛠 ADMIN
    { path: 'admin', component: DashboardComponent },

    // 🔐 LOGIN (lazy load recomendado)
    {
        path: 'login',
        loadComponent: () =>
            import('../app/features/auth/login/login')
                .then(m => m.LoginComponent)
    },

    // 📜 HISTORIAL DE COMPRAS
    {
        path: 'historial',
        loadComponent: () =>
            import('./features/historial/historial.component')
                .then(m => m.HistorialComponent)
    },

    // 🚫 FALLBACK
    { path: '**', redirectTo: '' }
];