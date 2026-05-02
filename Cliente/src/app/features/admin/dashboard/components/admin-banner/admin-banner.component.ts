import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-banner',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-banner.component.html',
    styleUrls: ['./admin-banner.component.css']
})
export class AdminBannerComponent {
    @Input() vistaActual!: string;
    @Output() cambiarVista = new EventEmitter<'productos' | 'pedidos' | 'usuarios'>();
    @Output() crearProducto = new EventEmitter<void>(); // Evento para disparar el modal
}