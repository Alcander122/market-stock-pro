import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../core/services/pedidos.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-historial',
  imports: [CommonModule],
  templateUrl: './historial.component.html'
})
export class HistorialComponent implements OnInit {

  pedidos: any[] = [];

  constructor(
    private pedidosService: PedidosService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    const usuario = this.authService.getUsuario();

    if (!usuario) return;

    this.pedidosService.obtenerHistorial(usuario.id)
      .subscribe(data => this.pedidos = data);
  }
}