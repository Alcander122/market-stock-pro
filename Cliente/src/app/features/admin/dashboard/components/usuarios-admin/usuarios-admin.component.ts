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

  crearUsuario() {
    Swal.fire({
      title: 'Crear Nuevo Usuario',
      html: `
        <div style="display:flex; flex-direction:column; gap:15px; text-align:left; margin-top: 15px;">
            <input id="swal-nombre" class="swal2-input" style="margin:0; width:100%; box-sizing: border-box;" placeholder="Nombre completo">
            <input id="swal-email" type="email" class="swal2-input" style="margin:0; width:100%; box-sizing: border-box;" placeholder="Correo electrónico">
            <input id="swal-password" type="password" class="swal2-input" style="margin:0; width:100%; box-sizing: border-box;" placeholder="Contraseña">
            <input id="swal-telefono" type="tel" class="swal2-input" style="margin:0; width:100%; box-sizing: border-box;" placeholder="Teléfono">
            <input id="swal-direccion" class="swal2-input" style="margin:0; width:100%; box-sizing: border-box;" placeholder="Dirección">
            <select id="swal-rol" class="swal2-select" style="margin:0; width:100%; box-sizing: border-box; display: flex;">
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
            </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombreCompleto = (document.getElementById('swal-nombre') as HTMLInputElement).value;
        const email = (document.getElementById('swal-email') as HTMLInputElement).value;
        const password = (document.getElementById('swal-password') as HTMLInputElement).value;
        const telefono = (document.getElementById('swal-telefono') as HTMLInputElement).value;
        const direccion = (document.getElementById('swal-direccion') as HTMLInputElement).value;
        const rol = (document.getElementById('swal-rol') as HTMLSelectElement).value;

        if (!nombreCompleto || !email || !password || !telefono || !direccion) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }

        return { nombreCompleto, email, password, telefono, direccion, rol };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.http.post(this.api, result.value).subscribe({
          next: () => {
            Swal.fire('Creado', 'Usuario creado con éxito', 'success');
            this.cargarUsuarios();
          },
          error: (err) => {
            console.error('Error creando usuario', err);
            let errMsg = 'No se pudo crear el usuario';
            if (err.error && err.error.message) {
              errMsg = Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message;
            }
            Swal.fire('Error', errMsg, 'error');
          }
        });
      }
    });
  }
}

