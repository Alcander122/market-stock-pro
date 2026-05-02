import { Component, EventEmitter, Output, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../core/services/carrito.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

    @Output() abrirCarrito = new EventEmitter<void>();
    
    carritoService = inject(CarritoService);
    authService = inject(AuthService);
    private router = inject(Router);

    usuario: any = null;
    private subArr: Subscription[] = [];

    ngOnInit() {
        const authSub = this.authService.usuario$.subscribe(user => {
            this.usuario = user;
        });
        this.subArr.push(authSub);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
        Swal.fire({
            icon: 'success',
            title: 'Sesión cerrada',
            text: 'Gracias por usar Horizon Market',
            timer: 1500,
            showConfirmButton: false
        });
    }

    ngOnDestroy() {
        this.subArr.forEach(s => s.unsubscribe());
    }
}
