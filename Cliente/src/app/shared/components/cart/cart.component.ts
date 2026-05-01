import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
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

    checkout() {
        const usuario = this.authService.getUsuario();

        // 🔐 VALIDAR LOGIN
        if (!usuario) {
            Swal.fire({
                icon: 'info',
                title: 'Inicia sesión',
                text: 'Debes estar logueado para confirmar tu pedido.',
                confirmButtonText: 'Ir al Login',
                confirmButtonColor: '#2e7d32',
                showCancelButton: true,
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.router.navigate(['/login']);
                    this.cerrar.emit();
                }
            });
            return;
        }

        // ⚠️ VALIDAR CARRITO
        if (this.items.length === 0) {
            Swal.fire('Carrito vacío', 'Agrega algunos productos antes de comprar.', 'warning');
            return;
        }

        // 🧾 ARMAR PEDIDO (Con conversión de tipos)
        const pedido = {
            usuarioId: Number(usuario.id), // Asegurar que el ID sea número
            total: Number(this.total),     // Asegurar que el total sea número
            items: this.items.map(i => ({
                productoId: Number(i.id),
                cantidad: Number(i.cantidad),
                precio: Number(i.precio) // 🔥 SOLUCIÓN: Convierte el string "3500.00" a número 3500
            }))
        };

        // 📡 ENVIAR
        this.pedidosService.crearPedido(pedido).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Pedido realizado!',
                    text: 'Tu compra se ha procesado con éxito.',
                    timer: 2500,
                    showConfirmButton: false
                });

                this.carritoService.limpiar();
                this.cerrar.emit();
                this.router.navigate(['/historial']);
            },
            error: (err) => {
                console.error('Error en el checkout:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar',
                    text: err.error?.message || 'Hubo un problema al conectar con el servidor.',
                });
            }
        });
    }
}