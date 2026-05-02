import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { ProductosService } from '../../../../../core/services/productos.service';
import { PedidosService } from '../../../../../core/services/pedidos.service';

import { Producto } from '../../../../../shared/models/producto.interface';
import { Pedido } from '../../../../../shared/models/pedido.interface';

import { AdminBannerComponent } from '../../components/admin-banner/admin-banner.component';
import { ProductosAdminComponent } from '../../components/productos-admin/productos-admin.component';
import { PedidosAdminComponent } from '../../components/pedidos-admin/pedidos-admin.component';
import { UsuariosAdminComponent } from '../../components/usuarios-admin/usuarios-admin.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        AdminBannerComponent,
        ProductosAdminComponent,
        PedidosAdminComponent,
        UsuariosAdminComponent
    ],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    private productosService = inject(ProductosService);
    private pedidosService = inject(PedidosService);

    vistaActual: 'productos' | 'pedidos' | 'usuarios' = 'productos';

    listaProductos: Producto[] = [];
    productosFiltrados: Producto[] = [];

    listaPedidos: Pedido[] = [];

    estadosPedido = ['PENDIENTE', 'PREPARANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

    ngOnInit() {
        this.cargarProductos();
        this.cargarPedidos();
    }

    cambiarVista(v: 'productos' | 'pedidos' | 'usuarios') {
        this.vistaActual = v;
    }

    cargarProductos() {
        this.productosService.obtenerProductos().subscribe(data => {
            this.listaProductos = data;
            this.productosFiltrados = data;
        });
    }

    filtrarPor(id: number) {
        this.productosFiltrados = id === 0
            ? this.listaProductos
            : this.listaProductos.filter(p => p.categoriaId === id);
    }

    cargarPedidos() {
        this.pedidosService.obtenerTodosParaAdmin().subscribe(data => {
            this.listaPedidos = data;
        });
    }

    cambiarEstadoPedido(id: number, estado: string) {
        this.pedidosService.actualizarEstado(id, estado).subscribe(() => {
            this.cargarPedidos();
            Swal.fire('OK', 'Estado actualizado', 'success');
        });
    }
}
