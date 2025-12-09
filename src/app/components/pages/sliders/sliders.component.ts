import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SliderService } from '../../../services/slider.service';
import { Slider } from '../../../models/slider.model';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-sliders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './sliders.component.html'
})
export class SlidersComponent implements OnInit {
  sliders: Slider[] = [];
  slidersFiltrados: Slider[] = [];
  busqueda: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  sliderForm: FormGroup;
  currentSlider: Slider | null = null;
  imagenPreview: string | null = null;
  imagenFile: File | null = null;
  
  paginaActual: number = 1;
  itemsPorPagina: number = 8;

  constructor(
    private fb: FormBuilder,
    private sliderService: SliderService
  ) {
    this.sliderForm = this.fb.group({
      _id: [''],
      title: ['', [Validators.required, Validators.minLength(3)]],
      link: ['', [Validators.required]],
      imagen: [''],
      state: [1]
    });
  }

  ngOnInit() {
    this.cargarSliders();
  }

  cargarSliders() {
    this.sliderService.list(this.busqueda).subscribe({
      next: (response) => {
        this.sliders = response.sliders;
        this.slidersFiltrados = this.sliders;
      },
      error: (error) => {
        console.error('Error al cargar sliders:', error);
        Swal.fire('Error', 'No se pudieron cargar los sliders', 'error');
      }
    });
  }

  buscarSlider() {
    if (this.busqueda.trim() === '') {
      this.slidersFiltrados = this.sliders;
    } else {
      this.slidersFiltrados = this.sliders.filter(slider =>
        slider.title.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
    this.paginaActual = 1;
  }

  abrirModal(slider?: Slider) {
    this.isEditing = !!slider;
    this.showModal = true;
    this.imagenPreview = null;
    this.imagenFile = null;

    if (slider) {
      this.currentSlider = slider;
      this.sliderForm.patchValue({
        _id: slider._id,
        title: slider.title,
        link: slider.link,
        state: slider.state
      });
      this.imagenPreview = slider.imagen_home || null;
    } else {
      this.sliderForm.reset({ state: 1 });
    }
  }

  cerrarModal() {
    this.showModal = false;
    this.isEditing = false;
    this.currentSlider = null;
    this.sliderForm.reset({ state: 1 });
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

  guardarSlider() {
    if (this.sliderForm.invalid) {
      Object.keys(this.sliderForm.controls).forEach(key => {
        this.sliderForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (!this.isEditing && !this.imagenFile) {
      Swal.fire('Error', 'Debes seleccionar una imagen', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.sliderForm.value.title);
    formData.append('link', this.sliderForm.value.link);
    formData.append('state', this.sliderForm.value.state);
    
    if (this.imagenFile) {
      formData.append('imagen', this.imagenFile);
    }

    if (this.isEditing) {
      formData.append('_id', this.sliderForm.value._id);
      this.sliderService.update(formData).subscribe({
        next: (response) => {
          Swal.fire('¡Éxito!', 'Slider actualizado correctamente', 'success');
          this.cerrarModal();
          this.cargarSliders();
        },
        error: (error) => {
          Swal.fire('Error', error.error.message || 'No se pudo actualizar el slider', 'error');
        }
      });
    } else {
      this.sliderService.register(formData).subscribe({
        next: (response) => {
          Swal.fire('¡Éxito!', 'Slider registrado correctamente', 'success');
          this.cerrarModal();
          this.cargarSliders();
        },
        error: (error) => {
          Swal.fire('Error', error.error.message || 'No se pudo registrar el slider', 'error');
        }
      });
    }
  }

  eliminarSlider(slider: Slider) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el slider ${slider.title}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && slider._id) {
        this.sliderService.delete(slider._id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El slider ha sido eliminado', 'success');
            this.cargarSliders();
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar el slider', 'error');
          }
        });
      }
    });
  }

  obtenerColorEstado(estado?: number): string {
    return estado === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }
}