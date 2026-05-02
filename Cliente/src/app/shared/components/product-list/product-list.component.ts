import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.interface';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, ProductCardComponent],
    templateUrl: './product-list.component.html'
})
export class ProductListComponent {

    @Input() productos: Producto[] = [];
    @Output() agregar = new EventEmitter<Producto>();

}
