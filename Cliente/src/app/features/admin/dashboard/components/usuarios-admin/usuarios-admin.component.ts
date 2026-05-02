import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css'
})
export class UsuariosAdminComponent implements OnInit {
  private api = 'http://localhost:3000/api/usuarios';
  private http = inject(HttpClient);

  usuarios = signal<any[]>([]);
  cargando = signal<boolean>(true);

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando.set(true);
    this.http.get<any[]>(this.api).subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.cargando.set(false);
      }
    });
  }

  editarRol(usuario: any) {
    const nuevoRol = usuario.rol === 'admin' ? 'cliente' : 'admin';
    
    Swal.fire({
      title: '¿Cambiar rol?',
      text: `¿Deseas cambiar el rol de ${usuario.nombreCompleto} a ${nuevoRol.toUpperCase()}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.patch(`${this.api}/${usuario.id}`, { rol: nuevoRol }).subscribe({
          next: () => {
            Swal.fire('Actualizado', 'Rol actualizado con éxito', 'success');
            this.cargarUsuarios();
          },
          error: () => Swal.fire('Error', 'No se pudo actualizar el rol', 'error')
        });
      }
    });
  }

  eliminarUsuario(id: number, nombre: string) {
    Swal.fire({
      title: `¿Eliminar a ${nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.api}/${id}`).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
            this.cargarUsuarios();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el usuario', 'error')
        });
      }
    });
  }
}
