import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CuponeService } from '../../../services/cupone.service';
import { ProductService } from '../../../services/product.service';
import { CategorieService } from '../../../services/categorie.service';
import { Cupone } from '../../../models/cupone.model';
import { Product } from '../../../models/product.model';
import { Categorie } from '../../../models/categorie.model';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-cupones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './cupones.component.html'
})
export class CuponesComponent implements OnInit {
  cupones: Cupone[] = [];
  cuponesFiltrados: Cupone[] = [];
  productos: Product[] = [];
  categorias: Categorie[] = [];
  busqueda: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  cuponeForm: FormGroup;
  currentCupone: Cupone | null = null;
  
  productosSeleccionados: string[] = [];
  categoriasSeleccionadas: string[] = [];
  
  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  constructor(
    private fb: FormBuilder,
    private cuponeService: CuponeService,
    private productService: ProductService,
    private categorieService: CategorieService
  ) {
    this.cuponeForm = this.fb.group({
      _id: [''],
      code: ['', [Validators.required, Validators.minLength(3)]],
      type_discount: [1, Validators.required],
      discount: [0, [Validators.required, Validators.min(0)]],
      type_count: [1, Validators.required],
      num_use: [0],
      type_segment: [1, Validators.required],
      state: [1]
    });
  }

  ngOnInit() {
    this.cargarCupones();
    this.cargarConfiguracion();
  }

  cargarCupones() {
    this.cuponeService.list(this.busqueda).subscribe({
      next: (response) => {
        this.cupones = response.cupones;
        this.cuponesFiltrados = this.cupones;
      },
      error: (error) => {
        console.error('Error al cargar cupones:', error);
        Swal.fire('Error', 'No se pudieron cargar los cupones', 'error');
      }
    });
  }

  cargarConfiguracion() {
    this.cuponeService.config().subscribe({
      next: (response) => {
        this.productos = response.products;
        this.categorias = response.categories;
      },
      error: (error) => {
        console.error('Error al cargar configuración:', error);
      }
    });
  }

  buscarCupone() {
    if (this.busqueda.trim() === '') {
      this.cuponesFiltrados = this.cupones;
    } else {
      this.cuponesFiltrados = this.cupones.filter(cupone =>
        cupone.code.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
    this.paginaActual = 1;
  }

  abrirModal(cupone?: Cupone) {
    this.isEditing = !!cupone;
    this.showModal = true;
    this.productosSeleccionados = [];
    this.categoriasSeleccionadas = [];

    if (cupone) {
      this.currentCupone = cupone;
      this.cuponeForm.patchValue(cupone);
      this.productosSeleccionados = cupone.products.map(p => p._id);
      this.categoriasSeleccionadas = cupone.categories.map(c => c._id);
    } else {
      this.cuponeForm.reset({ type_discount: 1, type_count: 1, type_segment: 1, state: 1 });
    }
  }

  cerrarModal() {
    this.showModal = false;
    this.isEditing = false;
    this.currentCupone = null;
    this.cuponeForm.reset({ type_discount: 1, type_count: 1, type_segment: 1, state: 1 });
    this.productosSeleccionados = [];
    this.categoriasSeleccionadas = [];
  }

  toggleProducto(productId: string) {
    const index = this.productosSeleccionados.indexOf(productId);
    if (index > -1) {
      this.productosSeleccionados.splice(index, 1);
    } else {
      this.productosSeleccionados.push(productId);
    }
  }

  toggleCategoria(categoriaId: string) {
    const index = this.categoriasSeleccionadas.indexOf(categoriaId);
    if (index > -1) {
      this.categoriasSeleccionadas.splice(index, 1);
    } else {
      this.categoriasSeleccionadas.push(categoriaId);
    }
  }

  guardarCupone() {
    if (this.cuponeForm.invalid) {
      Object.keys(this.cuponeForm.controls).forEach(key => {
        this.cuponeForm.get(key)?.markAsTouched();
      });
      return;
    }

    const cuponeData = {
      ...this.cuponeForm.value,
      products: this.productosSeleccionados.map(id => ({ _id: id })),
      categories: this.categoriasSeleccionadas.map(id => ({ _id: id }))
    };

    if (this.isEditing) {
      this.cuponeService.update(cuponeData).subscribe({
        next: (response) => {
          if (response.message === 200) {
            Swal.fire('¡Éxito!', 'Cupón actualizado correctamente', 'success');
            this.cerrarModal();
            this.cargarCupones();
          } else {
            Swal.fire('Error', response.message_text, 'error');
          }
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudo actualizar el cupón', 'error');
        }
      });
    } else {
      this.cuponeService.register(cuponeData).subscribe({
        next: (response) => {
          if (response.message === 200) {
            Swal.fire('¡Éxito!', 'Cupón registrado correctamente', 'success');
            this.cerrarModal();
            this.cargarCupones();
          } else {
            Swal.fire('Error', response.message_text, 'error');
          }
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudo registrar el cupón', 'error');
        }
      });
    }
  }

  eliminarCupone(cupone: Cupone) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el cupón ${cupone.code}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && cupone._id) {
        this.cuponeService.delete(cupone._id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El cupón ha sido eliminado', 'success');
            this.cargarCupones();
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar el cupón', 'error');
          }
        });
      }
    });
  }

  obtenerTextoTipoDescuento(tipo: number): string {
    return tipo === 1 ? 'Porcentaje' : 'Moneda';
  }

  obtenerTextoTipoContador(tipo: number): string {
    return tipo === 1 ? 'Ilimitado' : 'Limitado';
  }

  obtenerTextoSegmento(tipo: number): string {
    return tipo === 1 ? 'Productos' : 'Categorías';
  }

  obtenerColorEstado(estado?: number): string {
    return estado === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }
}