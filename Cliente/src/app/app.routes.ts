import { Routes } from '@angular/router';
import { Home as HomeComponent } from './features/shop/home/home';
import { DashboardComponent } from './features/admin/dashboard/pages/dashboard/dashboard.component';

export const routes: Routes = [

    // 🏠 HOME
    { path: '', component: HomeComponent },

    // 🛠 ADMIN
    { path: 'admin', component: DashboardComponent },

    // 🔐 LOGIN (lazy load recomendado)
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login')
                .then(m => m.LoginComponent)
    },
    
    // 📝 REGISTRO
    {
        path: 'registro',
        loadComponent: () =>
            import('./features/auth/registro/registro.component')
                .then(m => m.RegistroComponent)
    },

    // 📜 HISTORIAL DE COMPRAS
    {
        path: 'historial',
        loadComponent: () =>
            import('./features/shop/historial/historial.component')
                .then(m => m.HistorialComponent)
    },
    
    // 👤 PERFIL
    {
        path: 'perfil',
        loadComponent: () =>
            import('./features/shop/perfil/perfil.component')
                .then(m => m.PerfilComponent)
    },

    // 🚫 FALLBACK
    { path: '**', redirectTo: '' }
];