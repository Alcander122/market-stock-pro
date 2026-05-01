import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
            stock: [this.productoOriginal?.stock || 0, Validators.required],
            unidadMedida: [this.productoOriginal?.unidadMedida || 'LB', Validators.required],
            categoriaId: [this.productoOriginal?.categoria?.id || 1, Validators.required] // <-- ESTE NOMBRE
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) this.archivoSeleccionado = file;
    }

    guardar() {
        if (this.productoForm.valid) {
            this.alTerminar.emit({
                datos: this.productoForm.value,
                archivo: this.archivoSeleccionado
            });
        }
    }
}