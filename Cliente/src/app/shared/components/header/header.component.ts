import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../core/services/carrito.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

    // Evento para abrir el carrito
    @Output() abrirCarrito = new EventEmitter<void>();

    // Número total de unidades
    cantidad = 0;

    private sub!: Subscription;

    constructor(private carritoService: CarritoService) { }

    ngOnInit() {
        // Escucha cambios del carrito
        this.sub = this.carritoService.items$.subscribe(() => {
            this.cantidad = this.carritoService.getCantidadTotal();
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}