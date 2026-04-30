import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../core/services/carrito.service';
import { CartItem } from '../../../models/cart-item.model';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

    // Controla si el carrito está visible
    @Input() visible: boolean = false;

    // Evento para cerrar
    @Output() cerrar = new EventEmitter<void>();

    items: CartItem[] = [];
    total: number = 0;

    constructor(public carritoService: CarritoService) { }

    ngOnInit() {
        // Escucha cambios del carrito
        this.carritoService.items$.subscribe(items => {
            this.items = items;
            this.total = this.carritoService.getTotal();
        });
    }

    eliminar(index: number) {
        this.carritoService.eliminar(index);
    }
}