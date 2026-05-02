import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PedidosService } from '../../../core/services/pedidos.service';
import { AuthService } from '../../../core/services/auth.service';
import { PedidoVista } from '../../../shared/models/PedidoVista.interface';

@Component({
  standalone: true,
  selector: 'app-historial',
  imports: [CommonModule, RouterModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Inicializamos como Signals para Angular 19
  pedidos = signal<PedidoVista[]>([]);
  cargando = signal<boolean>(true);

  pasosStepper = [
    { estado: 'PENDIENTE', label: 'Orden Recibida', icon: '📝' },
    { estado: 'PREPARANDO', label: 'En Preparación', icon: '📦' },
    { estado: 'ENVIADO', label: 'En Camino', icon: '🚚' },
    { estado: 'ENTREGADO', label: 'Entregado', icon: '✅' }
  ];

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    const usuario = this.authService.getUsuario();
    if (!usuario?.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargando.set(true);
    this.pedidosService.obtenerHistorial(usuario.id).subscribe({
      next: (data) => {
        // Transformamos los datos para incluir la propiedad de expansión
        const mapeados: PedidoVista[] = data.map((p: any) => ({
          ...p,
          expandido: false
        }));
        this.pedidos.set(mapeados);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al recuperar el historial', err);
        this.cargando.set(false);
      }
    });
  }

  togglePedido(id: number) {
    // Actualizamos el Signal de forma inmutable
    this.pedidos.update(lista =>
      lista.map(p => p.id === id ? { ...p, expandido: !p.expandido } : p)
    );
  }

  getIndicePasoActual(estadoActual: string): number {
    if (estadoActual === 'CANCELADO') return -1;
    return this.pasosStepper.findIndex(p => p.estado === estadoActual);
  }
}