import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoFormComponent } from "../../../producto-form/producto-form.component";
import { ProductosService } from '../../../../../core/services/productos.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-productos-admin',
    standalone: true,
    imports: [CommonModule, ProductoFormComponent],
    templateUrl: './productos-admin.component.html',
    styleUrls: ['./productos-admin.component.css']
})
export class ProductosAdminComponent {
    @Input() productos: any[] = [];
    @Output() filtrar = new EventEmitter<number>();
    @Output() recargar = new EventEmitter<void>();

    private productosService = inject(ProductosService);

    // ✅ Control de estado reactivo para el modal
    mostrarModal = signal<boolean>(false);
    productoSeleccionado = signal<any>(null);

    // ✅ Esta función será llamada por el banner mediante una referencia local
    abrirNuevo() {
        this.productoSeleccionado.set(null);
        this.mostrarModal.set(true);
    }

    abrirEditar(producto: any) {
        this.productoSeleccionado.set(producto);
        this.mostrarModal.set(true);
    }

    cerrarModal() {
        this.mostrarModal.set(false);
    }

    guardarCambios(event: { datos: any, archivo: File | null }) {
        const accion = this.productoSeleccionado()
            ? this.productosService.actualizarProducto(this.productoSeleccionado().id, event.datos)
            : this.productosService.crearProducto(event.datos);

        accion.subscribe({
            next: (productoGuardado: any) => {
                const id = this.productoSeleccionado() ? this.productoSeleccionado().id : productoGuardado.id;
                
                if (event.archivo) {
                    const formData = new FormData();
                    formData.append('file', event.archivo);
                    this.productosService.subirImagen(id, formData).subscribe({
                        next: () => {
                            Swal.fire('Éxito', 'Producto e imagen guardados correctamente', 'success');
                            this.cerrarModal();
                            this.recargar.emit();
                        },
                        error: () => {
                            Swal.fire('Advertencia', 'El producto se guardó pero hubo un error con la imagen', 'warning');
                            this.cerrarModal();
                            this.recargar.emit();
                        }
                    });
                } else {
                    Swal.fire('Éxito', 'Producto guardado correctamente', 'success');
                    this.cerrarModal();
                    this.recargar.emit();
                }
            },
            error: (err) => {
                console.error(err);
                Swal.fire('Error', 'No se pudo guardar el producto', 'error');
            }
        });
    }
}