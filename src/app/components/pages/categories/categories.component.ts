import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CategorieService } from '../../../services/categorie.service';
import { Categorie } from '../../../models/categorie.model';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  categorias: Categorie[] = [];
  categoriasFiltradas: Categorie[] = [];
  busqueda: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  categorieForm: FormGroup;
  currentCategorie: Categorie | null = null;
  imagenPreview: string | null = null;
  imagenFile: File | null = null;
  
  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  constructor(
    private fb: FormBuilder,
    private categorieService: CategorieService
  ) {
    this.categorieForm = this.fb.group({
      _id: [''],
      title: ['', [Validators.required, Validators.minLength(3)]],
      imagen: [''],
      state: [1]
    });
  }

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categorieService.list(this.busqueda).subscribe({
      next: (response) => {
        this.categorias = response.categories;
        this.categoriasFiltradas = this.categorias;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
      }
    });
  }

  buscarCategoria() {
    if (this.busqueda.trim() === '') {
      this.categoriasFiltradas = this.categorias;
    } else {
      this.categoriasFiltradas = this.categorias.filter(cat =>
        cat.title.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
    this.paginaActual = 1;
  }

  abrirModal(categoria?: Categorie) {
    this.isEditing = !!categoria;
    this.showModal = true;
    this.imagenPreview = null;
    this.imagenFile = null;

    if (categoria) {
      this.currentCategorie = categoria;
      this.categorieForm.patchValue({
        _id: categoria._id,
        title: categoria.title,
        state: categoria.state
      });
      this.imagenPreview = categoria.imagen_home || null;
    } else {
      this.categorieForm.reset({ state: 1 });
    }
  }

  cerrarModal() {
    this.showModal = false;
    this.isEditing = false;
    this.currentCategorie = null;
    this.categorieForm.reset({ state: 1 });
    this.imagenPreview = null;
    this.imagenFile = null;
  }

  seleccionarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarCategoria() {
    if (this.categorieForm.invalid) {
      Object.keys(this.categorieForm.controls).forEach(key => {
        this.categorieForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (!this.isEditing && !this.imagenFile) {
      Swal.fire('Error', 'Debes seleccionar una imagen', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.categorieForm.value.title);
    formData.append('state', this.categorieForm.value.state);
    
    if (this.imagenFile) {
      formData.append('portada', this.imagenFile);
    }

    if (this.isEditing) {
      formData.append('_id', this.categorieForm.value._id);
      this.categorieService.update(formData).subscribe({
        next: (response) => {
          Swal.fire('¡Éxito!', 'Categoría actualizada correctamente', 'success');
          this.cerrarModal();
          this.cargarCategorias();
        },
        error: (error) => {
          Swal.fire('Error', error.error.message || 'No se pudo actualizar la categoría', 'error');
        }
      });
    } else {
      this.categorieService.register(formData).subscribe({
        next: (response) => {
          Swal.fire('¡Éxito!', 'Categoría registrada correctamente', 'success');
          this.cerrarModal();
          this.cargarCategorias();
        },
        error: (error) => {
          Swal.fire('Error', error.error.message || 'No se pudo registrar la categoría', 'error');
        }
      });
    }
  }

  eliminarCategoria(categoria: Categorie) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la categoría ${categoria.title}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && categoria._id) {
        this.categorieService.delete(categoria._id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'La categoría ha sido eliminada', 'success');
            this.cargarCategorias();
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
          }
        });
      }
    });
  }

  obtenerColorEstado(estado?: number): string {
    return estado === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }
}