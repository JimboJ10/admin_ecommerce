import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule, FormsModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  usuarios: User[] = [];
  usuariosFiltrados: User[] = [];
  busqueda: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  userForm: FormGroup;
  currentUser: User | null = null;
  
  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      _id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      phone: [''],
      rol: ['admin', Validators.required],
      state: [1]
    });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService.list(this.busqueda).subscribe({
      next: (response) => {
        this.usuarios = response.users;
        this.usuariosFiltrados = this.usuarios;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  buscarUsuario() {
    if (this.busqueda.trim() === '') {
      this.usuariosFiltrados = this.usuarios;
    } else {
      this.usuariosFiltrados = this.usuarios.filter(user =>
        user.name.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        user.email.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        user.surname?.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
    this.paginaActual = 1;
  }

  abrirModal(usuario?: User) {
    this.isEditing = !!usuario;
    this.showModal = true;

    if (usuario) {
      this.currentUser = usuario;
      this.userForm.patchValue({
        _id: usuario._id,
        name: usuario.name,
        surname: usuario.surname,
        email: usuario.email,
        phone: usuario.phone,
        rol: usuario.rol,
        state: usuario.state
      });
      // En edición, password no es requerido
      this.userForm.get('password')?.clearValidators();
    } else {
      this.userForm.reset({ rol: 'admin', state: 1 });
      // En creación, password es requerido
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }

  cerrarModal() {
    this.showModal = false;
    this.isEditing = false;
    this.currentUser = null;
    this.userForm.reset({ rol: 'admin', state: 1 });
  }

  guardarUsuario() {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
      return;
    }

    const userData = this.userForm.value;
    
    // Si no hay password en edición, eliminarlo del objeto
    if (this.isEditing && !userData.password) {
      delete userData.password;
    }

    if (this.isEditing) {
      this.userService.update(userData).subscribe({
        next: (response) => {
          Swal.fire('¡Éxito!', 'Usuario actualizado correctamente', 'success');
          this.cerrarModal();
          this.cargarUsuarios();
        },
        error: (error) => {
          Swal.fire('Error', error.error.message || 'No se pudo actualizar el usuario', 'error');
        }
      });
    } else {
      this.userService.register(userData).subscribe({
        next: (response) => {
          Swal.fire('¡Éxito!', 'Usuario registrado correctamente', 'success');
          this.cerrarModal();
          this.cargarUsuarios();
        },
        error: (error) => {
          Swal.fire('Error', error.error.message || 'No se pudo registrar el usuario', 'error');
        }
      });
    }
  }

  eliminarUsuario(user: User) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al usuario ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && user._id) {
        this.userService.delete(user._id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado', 'success');
            this.cargarUsuarios();
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
          }
        });
      }
    });
  }

  obtenerIniciales(nombre: string, apellido?: string): string {
    const inicial1 = nombre.charAt(0).toUpperCase();
    const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : '';
    return inicial1 + inicial2;
  }

  obtenerColorEstado(estado?: number): string {
    return estado === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }
}