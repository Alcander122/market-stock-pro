import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../core/services/productos.service';
import { PedidosService } from '../../core/services/pedidos.service';
import Swal from 'sweetalert2';
import { ProductoFormComponent } from '../producto-form/producto-form.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, ProductoFormComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    // Inyección de servicios
    private productosService = inject(ProductosService);
    private pedidosService = inject(PedidosService);
    private cdr = inject(ChangeDetectorRef);

    // Control de Vistas
    vistaActual: 'productos' | 'pedidos' = 'productos';

    // Datos de Inventario
    listaProductos: any[] = [];
    productosFiltrados: any[] = [];
    mostrarFormulario = false;
    productoAEditar: any = null;

    // Datos de Pedidos
    listaPedidos: any[] = [];
    estadosPedido = ['PENDIENTE', 'PREPARANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

    ngOnInit() {
        this.cargarProductos();
        this.cargarPedidos();
    }

    // Alternar entre pestañas de Inventario y Pedidos
    cambiarVista(vista: 'productos' | 'pedidos') {
        this.vistaActual = vista;
        if (vista === 'pedidos') {
            this.cargarPedidos();
        } else {
            this.cargarProductos();
        }
    }

    // --- LÓGICA DE PRODUCTOS ---

    cargarProductos() {
        this.productosService.obtenerProductos().subscribe({
            next: (datos) => {
                // 1. Guardamos la lista completa
                this.listaProductos = datos;

                // 2. IMPORTANTE: Asignamos los datos a la lista que recorre el HTML
                // Si productosFiltrados está vacío, no verás nada hasta filtrar.
                this.productosFiltrados = [...datos];

                // 3. Forzamos la detección de cambios para pintar las cards
                this.cdr.detectChanges();

                console.log('📦 Productos cargados con éxito');
            },
            error: (err) => {
                console.error('❌ Error al cargar productos:', err);
            }
        });
    }

    filtrarPor(idCategoria: number) {
        if (idCategoria === 0) {
            this.productosFiltrados = [...this.listaProductos];
        } else {
            this.productosFiltrados = this.listaProductos.filter(p => {
                const catId = p.categoriaId || p.categoria?.id || p.categoria_id;
                return catId == idCategoria;
            });
        }
        this.cdr.detectChanges();
    }

    abrirFormularioCrear() {
        this.productoAEditar = null;
        this.mostrarFormulario = true;
    }

    editarProducto(producto: any) {
        this.productoAEditar = producto;
        this.mostrarFormulario = true;
    }

    cerrarFormulario() {
        this.mostrarFormulario = false;
        this.productoAEditar = null;
    }

    procesarGuardado(evento: { datos: any, archivo: File | null }) {
        const datosParaEnviar = {
            nombre: evento.datos.nombre,
            precioReferencia: Number(evento.datos.precioReferencia),
            stock: Number(evento.datos.stock),
            unidadMedida: evento.datos.unidadMedida || 'UNIDAD',
            categoriaId: Number(evento.datos.categoriaId)
        };

        if (this.productoAEditar) {
            // Actualizar producto existente
            this.productosService.actualizarProducto(this.productoAEditar.id, datosParaEnviar).subscribe({
                next: () => {
                    if (evento.archivo) {
                        this.subirImagenYFinalizar(this.productoAEditar.id, evento.archivo);
                    } else {
                        this.finalizarExito('Producto actualizado correctamente');
                    }
                },
                error: (err) => {
                    const msj = Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message;
                    Swal.fire('Error al actualizar', msj, 'error');
                }
            });
        } else {
            // Crear nuevo producto
            this.productosService.crearProducto(datosParaEnviar).subscribe({
                next: (nuevo: any) => {
                    if (evento.archivo) {
                        this.subirImagenYFinalizar(nuevo.id, evento.archivo);
                    } else {
                        this.finalizarExito('Producto creado correctamente');
                    }
                },
                error: (err) => {
                    const msj = Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message;
                    Swal.fire('Error de creación', msj, 'error');
                }
            });
        }
    }

    private subirImagenYFinalizar(id: number, archivo: File) {
        const formData = new FormData();
        formData.append('file', archivo);
        this.productosService.subirImagen(id, formData).subscribe({
            next: () => this.finalizarExito('Producto e imagen guardados con éxito'),
            error: () => Swal.fire('Aviso', 'Producto guardado pero hubo un error con la imagen', 'warning')
        });
    }

    private finalizarExito(mensaje: string) {
        this.cerrarFormulario();
        this.cargarProductos();
        Swal.fire('¡Éxito!', mensaje, 'success');
    }


    // --- LÓGICA DE PEDIDOS ---

    cargarPedidos() {
        this.pedidosService.obtenerTodosParaAdmin().subscribe({
            next: (datos) => {
                this.listaPedidos = datos;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('❌ Error al cargar pedidos:', err)
        });
    }

    cambiarEstadoPedido(id: number, event: any) {
        const nuevoEstado = event.target.value;
        this.pedidosService.actualizarEstado(id, nuevoEstado).subscribe({
            next: () => {
                Swal.fire({
                    title: 'Estado Actualizado',
                    text: `El pedido #${id} ahora está ${nuevoEstado}`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                this.cargarPedidos(); // Refrescar tabla
            },
            error: (err) => {
                console.error('Error al cambiar estado:', err);
                Swal.fire('Error', 'No se pudo actualizar el estado del pedido', 'error');
            }
        });
    }
}