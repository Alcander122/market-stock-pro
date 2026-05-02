import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.interface';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

    @Input({ required: true }) producto!: any; @Output() agregar = new EventEmitter<Producto>();

}
