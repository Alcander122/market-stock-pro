import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../core/services/carrito.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule, Router } from '@angular/router'; // 👈 Importamos Router
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
    cantidad = 0;
    usuario: any = null;
    private subArr: Subscription[] = [];

    // 👈 Inyectamos el Router en el constructor
    constructor(
        private carritoService: CarritoService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        const cartSub = this.carritoService.items$.subscribe(() => {
            this.cantidad = this.carritoService.getCantidadTotal();
        });

        const authSub = this.authService.usuario$.subscribe(user => {
            this.usuario = user;
        });

        // Guardamos las suscripciones para limpiarlas después
        this.subArr.push(cartSub, authSub);
    }

    logout() {
        this.authService.logout();

        // 🔥 Redirigir a la vista normal (Home) inmediatamente
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