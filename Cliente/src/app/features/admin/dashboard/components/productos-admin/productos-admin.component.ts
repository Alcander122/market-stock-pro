import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoFormComponent } from "../../../producto-form/producto-form.component";

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
        console.log('Datos listos para enviar a NestJS:', event.datos);
        this.cerrarModal();
    }
}