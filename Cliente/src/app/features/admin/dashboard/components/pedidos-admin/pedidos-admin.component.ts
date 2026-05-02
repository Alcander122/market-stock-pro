import { Component, EventEmitter, Input, Output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos-admin.component.html',
  styleUrls: ['./pedidos-admin.component.css']
})
export class PedidosAdminComponent {

  private _pedidos = signal<any[]>([]);

  @Input() 
  set pedidos(value: any[]) {
    this._pedidos.set(value || []);
  }
  
  @Input() estados: string[] = [];
  @Output() cambiarEstado = new EventEmitter<{ id: number, estado: string }>();

  // Señal para filtrado local si es necesario, o simplemente exponer listado
  pedidosList = computed(() => this._pedidos());

  onCambiarEstado(id: number, event: Event) {
    const estado = (event.target as HTMLSelectElement).value;
    this.cambiarEstado.emit({ id, estado });
  }
}