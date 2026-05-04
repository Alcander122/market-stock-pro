import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  usuarioActual: any;
  private api = 'http://localhost:3000/api/usuarios';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.perfilForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      password: [''] // Opcional, solo si quiere cambiarla
    });
  }

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuario();
    if (!this.usuarioActual) {
      this.router.navigate(['/login']);
      return;
    }
    this.perfilForm.patchValue({
      nombreCompleto: this.usuarioActual.nombreCompleto,
      email: this.usuarioActual.email,
      telefono: this.usuarioActual.telefono || '',
      direccion: this.usuarioActual.direccion || ''
    });
  }

  goBack() {
    window.history.back();
  }

  guardarCambios() {
    if (this.perfilForm.invalid) return;

    const datos = { ...this.perfilForm.value };
    if (!datos.password) {
      delete datos.password;
    }

    this.http.patch(`${this.api}/${this.usuarioActual.id}`, datos).subscribe({
      next: (res) => {
        Swal.fire('¡Actualizado!', 'Tu perfil ha sido actualizado correctamente.', 'success');
        // Actualizamos localstorage de manera rápida
        const user = { ...this.usuarioActual, ...res };
        localStorage.setItem('usuario', JSON.stringify(user));
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el perfil', 'error')
    });
  }

  eliminarCuenta() {
    Swal.fire({
      title: '¿Estás completamente seguro?',
      text: "Esta acción eliminará tu cuenta y todo tu historial de forma irreversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar mi cuenta',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.api}/${this.usuarioActual.id}`).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'Tu cuenta ha sido borrada.', 'success').then(() => {
              this.authService.logout();
              this.router.navigate(['/']);
            });
          },
          error: () => Swal.fire('Error', 'No pudimos eliminar la cuenta.', 'error')
        });
      }
    });
  }
}
