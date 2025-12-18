import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DiscountService } from '../../../services/discount.service';
import { ProductService } from '../../../services/product.service';
import { CategorieService } from '../../../services/categorie.service';
import { Discount } from '../../../models/discount.model';
import { Product } from '../../../models/product.model';
import { Categorie } from '../../../models/categorie.model';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './discounts.component.html'
})
export class DiscountsComponent implements OnInit {
  descuentos: Discount[] = [];
  productos: Product[] = [];
  categorias: Categorie[] = [];
  showModal: boolean = false;
  isEditing: boolean = false;
  discountForm: FormGroup;
  currentDiscount: Discount | null = null;
  
  productosSeleccionados: string[] = [];
  categoriasSeleccionadas: string[] = [];
  
  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  constructor(
    private fb: FormBuilder,
    private discountService: DiscountService,
    private productService: ProductService,
    private categorieService: CategorieService
  ) {
    this.discountForm = this.fb.group({
      _id: [''],
      type_campaign: [1, Validators.required],
      type_discount: [1, Validators.required],
      discount: [0, [Validators.required, Validators.min(0)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      type_segment: [1, Validators.required],
      state: [1]
    });
  }

  ngOnInit() {
    this.cargarDescuentos();
    this.cargarConfiguracion();
  }

  get typeSegment(): number {
    const value = this.discountForm.get('type_segment')?.value;
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    return numValue || 1;
  }
  
  mostrarProductos(): boolean {
    const resultado = this.typeSegment === 1;
    return resultado;
  }
  
  mostrarCategorias(): boolean {
    const resultado = this.typeSegment === 2;
    return resultado;
  }

  cargarDescuentos() {
    this.discountService.list().subscribe({
      next: (response) => {
        this.descuentos = response.discounts;
      },
      error: (error) => {
        console.error('Error al cargar descuentos:', error);
        Swal.fire('Error', 'No se pudieron cargar los descuentos', 'error');
      }
    });
  }

  cargarConfiguracion() {
    
    this.discountService.config().subscribe({
      next: (response) => {
        this.productos = response.products || [];
        this.categorias = response.categories || [];
      },
      error: (error) => {
        console.error('❌ Error al cargar configuración:', error);
        Swal.fire('Error', 'No se pudo cargar la configuración', 'error');
      }
    });
  }

  abrirModal(descuento?: Discount) {
    
    this.isEditing = !!descuento;
    this.showModal = true;
    this.productosSeleccionados = [];
    this.categoriasSeleccionadas = [];

    if (descuento) {
      this.currentDiscount = descuento;
      this.discountForm.patchValue({
        _id: descuento._id,
        type_campaign: descuento.type_campaign,
        type_discount: descuento.type_discount,
        discount: descuento.discount,
        start_date: new Date(descuento.start_date).toISOString().slice(0, 16),
        end_date: new Date(descuento.end_date).toISOString().slice(0, 16),
        type_segment: descuento.type_segment,
        state: descuento.state
      });
      this.productosSeleccionados = descuento.products.map(p => p._id);
      this.categoriasSeleccionadas = descuento.categories.map(c => c._id);
    } else {
      this.discountForm.reset({ 
        type_campaign: 1, 
        type_discount: 1, 
        type_segment: 1, 
        state: 1 
      });
    }
  }

  cerrarModal() {
    this.showModal = false;
    this.isEditing = false;
    this.currentDiscount = null;
    this.discountForm.reset({ type_campaign: 1, type_discount: 1, type_segment: 1, state: 1 });
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

  guardarDescuento() {
    if (this.discountForm.invalid) {
      Object.keys(this.discountForm.controls).forEach(key => {
        this.discountForm.get(key)?.markAsTouched();
      });
      return;
    }

    const startDate = new Date(this.discountForm.value.start_date);
    const endDate = new Date(this.discountForm.value.end_date);

    const discountData = {
      ...this.discountForm.value,
      start_date_num: startDate.getTime(),
      end_date_num: endDate.getTime(),
      products: this.discountForm.value.type_segment === 1 
        ? this.productosSeleccionados.map(id => ({ _id: id })) 
        : [],
      categories: this.discountForm.value.type_segment === 2 
        ? this.categoriasSeleccionadas.map(id => ({ _id: id })) 
        : [],
      product_s: this.productosSeleccionados,
      categorie_s: this.categoriasSeleccionadas
    };

    if (this.isEditing) {
      this.discountService.update(discountData).subscribe({
        next: (response) => {
          if (response.message === 200) {
            Swal.fire('¡Éxito!', 'Descuento actualizado correctamente', 'success');
            this.cerrarModal();
            this.cargarDescuentos();
          } else {
            Swal.fire('Error', response.message_text, 'error');
          }
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudo actualizar el descuento', 'error');
        }
      });
    } else {
      this.discountService.register(discountData).subscribe({
        next: (response) => {
          if (response.message === 200) {
            Swal.fire('¡Éxito!', 'Descuento registrado correctamente', 'success');
            this.cerrarModal();
            this.cargarDescuentos();
          } else {
            Swal.fire('Error', response.message_text, 'error');
          }
        },
        error: (error) => {
          Swal.fire('Error', 'No se pudo registrar el descuento', 'error');
        }
      });
    }
  }

  eliminarDescuento(descuento: Discount) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este descuento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && descuento._id) {
        this.discountService.delete(descuento._id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El descuento ha sido eliminado', 'success');
            this.cargarDescuentos();
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar el descuento', 'error');
          }
        });
      }
    });
  }

  obtenerTextoTipoCampania(tipo: number): string {
    return tipo === 1 ? 'Campaña Normal' : 'Venta Flash';
  }

  obtenerTextoTipoDescuento(tipo: number): string {
    return tipo === 1 ? 'Porcentaje' : 'Moneda';
  }

  obtenerTextoSegmento(tipo: number): string {
    return tipo === 1 ? 'Productos' : 'Categorías';
  }

  obtenerColorEstado(estado?: number): string {
    return estado === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  obtenerColorCampania(tipo: number): string {
    return tipo === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800';
  }

  trackByProductoId(index: number, producto: Product): string {
    return producto._id || index.toString();
  }

  trackByCategoriaId(index: number, categoria: Categorie): string {
    return categoria._id || index.toString();
  }
}