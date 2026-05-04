import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
    selector: 'app-producto-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './producto-form.component.html',
    styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {
    @Input() productoOriginal: any = null;
    @Output() alTerminar = new EventEmitter<{ datos: any, archivo: File | null }>();
    @Output() alCancelar = new EventEmitter<void>();

    productoForm!: FormGroup;
    archivoSeleccionado: File | null = null;

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.productoForm = this.fb.group({
            nombre: [this.productoOriginal?.nombre || '', Validators.required],
            precioReferencia: [this.productoOriginal?.precioReferencia || 0, Validators.required],
            stockActual: [this.productoOriginal?.stockActual || 0, Validators.required],
            unidadMedida: [this.productoOriginal?.unidadMedida || 'LB', Validators.required],
            categoriaId: [this.productoOriginal?.categoria?.id || 1, Validators.required],
            metadataItems: this.fb.array([]) // Array para filas dinámicas de metadatos
        });

        if (this.productoOriginal?.metadata) {
            Object.keys(this.productoOriginal.metadata).forEach(key => {
                this.metadataItems.push(this.fb.group({
                    clave: [key, Validators.required],
                    valor: [this.productoOriginal.metadata[key], Validators.required]
                }));
            });
        }
    }

    get metadataItems() { return this.productoForm.get('metadataItems') as FormArray; }

    // ✅ Métodos para la gestión dinámica de características
    agregarMetadato() {
        this.metadataItems.push(this.fb.group({ clave: ['', Validators.required], valor: ['', Validators.required] }));
    }

    eliminarMetadato(index: number) {
        this.metadataItems.removeAt(index);
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) this.archivoSeleccionado = file;
    }

    guardar() {
        if (this.productoForm.valid) {
            const formValue = { ...this.productoForm.value };
            const metadataObj: Record<string, any> = {};

            // Conversión de FormArray a objeto JSON para el backend
            formValue.metadataItems.forEach((item: any) => {
                if (item.clave) metadataObj[item.clave] = item.valor;
            });

            formValue.metadata = metadataObj;
            delete formValue.metadataItems;

            // ✅ Convertir a números para que NestJS (ValidationPipe) los acepte
            formValue.precioReferencia = Number(formValue.precioReferencia);
            formValue.stockActual = Number(formValue.stockActual);
            formValue.categoriaId = Number(formValue.categoriaId);

            this.alTerminar.emit({ datos: formValue, archivo: this.archivoSeleccionado });
        }
    }
}