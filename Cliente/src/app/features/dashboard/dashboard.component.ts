import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../core/services/productos.service';
import Swal from 'sweetalert2';
import { ProductoFormComponent } from '../producto-form/producto-form.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, ProductoFormComponent], // Importamos el nuevo componente
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    private productosService = inject(ProductosService);
    private cdr = inject(ChangeDetectorRef);

    listaProductos: any[] = [];
    productosFiltrados: any[] = [];

    // Variables de control para el Modal Separado
    mostrarFormulario = false;
    productoAEditar: any = null;

    ngOnInit() {
        this.cargarProductos();
    }

    cargarProductos() {
        this.productosService.obtenerProductos().subscribe({
            next: (datos) => {
                this.listaProductos = datos;
                this.productosFiltrados = datos;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('❌ Error:', err)
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

    // --- LÓGICA DEL NUEVO MODAL SEPARADO ---

    abrirFormularioCrear() {
        this.productoAEditar = null; // Indica que es creación
        this.mostrarFormulario = true;
    }

    editarProducto(producto: any) {
        this.productoAEditar = producto; // Pasa los datos para edición
        this.mostrarFormulario = true;
    }

    cerrarFormulario() {
        this.mostrarFormulario = false;
        this.productoAEditar = null;
    }

    procesarGuardado(evento: { datos: any, archivo: File | null }) {
        // 1. LIMPIEZA TOTAL: Solo enviamos lo que el DTO espera
        const datosParaEnviar = {
            nombre: evento.datos.nombre,
            precioReferencia: Number(evento.datos.precioReferencia),
            stockActual: Number(evento.datos.stockActual),
            unidadMedida: evento.datos.unidadMedida || 'UNIDAD',
            // ENVIAMOS EL ID DIRECTO, NO UN OBJETO
            categoriaId: Number(evento.datos.categoriaId)
        };

        console.log('Enviando al servidor:', datosParaEnviar);

        if (this.productoAEditar) {
            // LÓGICA DE UPDATE
            this.productosService.actualizarProducto(this.productoAEditar.id, datosParaEnviar).subscribe({
                next: () => {
                    if (evento.archivo) {
                        this.subirImagenYFinalizar(this.productoAEditar.id, evento.archivo);
                    } else {
                        this.finalizarExito('Producto actualizado');
                    }
                },
                error: (err) => {
                    const msj = Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message;
                    Swal.fire('Error al actualizar', msj, 'error');
                }
            });
        } else {
            // LÓGICA DE CREATE
            this.productosService.crearProducto(datosParaEnviar).subscribe({
                next: (nuevo: any) => {
                    if (evento.archivo) {
                        this.subirImagenYFinalizar(nuevo.id, evento.archivo);
                    } else {
                        this.finalizarExito('Producto creado');
                    }
                },
                error: (err) => {
                    // Manejo de errores de validación de NestJS
                    const msj = Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message;
                    Swal.fire('Error de validación', msj, 'error');
                }
            });
        }
    }

    private subirImagenYFinalizar(id: number, archivo: File) {
        const formData = new FormData();
        formData.append('file', archivo);
        this.productosService.subirImagen(id, formData).subscribe({
            next: () => this.finalizarExito('Producto e imagen guardados')
        });
    }

    private finalizarExito(mensaje: string) {
        this.cerrarFormulario();
        this.cargarProductos();
        Swal.fire('¡Éxito!', mensaje, 'success');
    }
}