import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CarritoService } from '../../../core/services/carrito.service';
import { PedidosService } from '../../../core/services/pedidos.service';
import { AuthService } from '../../../core/services/auth.service';

import { CartItem } from '../../../models/cart-item.model';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

    @Input() visible: boolean = false;
    @Output() cerrar = new EventEmitter<void>();

    items: CartItem[] = [];
    total: number = 0;

    constructor(
        public carritoService: CarritoService,
        private pedidosService: PedidosService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.carritoService.items$.subscribe(items => {
            this.items = items;
            this.total = this.carritoService.getTotal();
        });
    }

    eliminar(index: number) {
        this.carritoService.eliminar(index);
    }

    // 🔥 CHECKOUT REAL
    checkout() {

        const usuario = this.authService.getUsuario();

        // 🔐 VALIDAR LOGIN
        if (!usuario) {
            alert('Debes iniciar sesión para comprar');
            this.router.navigate(['/login']);
            return;
        }

        // ⚠️ VALIDAR CARRITO
        if (this.items.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        // 🧾 ARMAR PEDIDO
        const pedido = {
            usuarioId: usuario.id,
            total: this.total,
            items: this.items.map(i => ({
                productoId: i.id,
                cantidad: i.cantidad,
                precio: i.precio
            }))
        };

        // 📡 ENVIAR
        this.pedidosService.crearPedido(pedido).subscribe({
            next: () => {
                alert('Compra realizada con éxito ✅');

                this.carritoService.limpiar();
                this.cerrar.emit();

                this.router.navigate(['/historial']);
            },
            error: (err) => {
                console.error('Error al crear pedido', err);
                alert('Error al procesar la compra');
            }
        });
    }
}