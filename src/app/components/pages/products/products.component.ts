import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategorieService } from '../../../services/categorie.service';
import { Product, Variedad } from '../../../models/product.model';
import { Categorie } from '../../../models/categorie.model';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { QuillModule } from 'ngx-quill';
import { LoadingSpinnerComponent } from "../../../shared/components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ReactiveFormsModule, FormsModule, NgxPaginationModule, QuillModule, LoadingSpinnerComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  productos: Product[] = [];
  productosFiltrados: Product[] = [];
  categorias: Categorie[] = [];
  busqueda: string = '';
  categoriaFiltro: string = '';
  showModal: boolean = false;
  showVariedadModal: boolean = false;
  showGaleriaModal: boolean = false;
  isEditing: boolean = false;
  productForm: FormGroup;
  variedadForm: FormGroup;
  currentProduct: Product | null = null;
  portadaPreview: string | null = null;
  portadaFile: File | null = null;
  galeriaFile: File | null = null;
  galeriaPreview: string | null = null;
  loading = false;
  
  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image']
    ]
  };

  variedades: Variedad[] = [];
  isEditingVariedad: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categorieService: CategorieService
  ) {
    this.productForm = this.fb.group({
      _id: [''],
      title: ['', [Validators.required, Validators.minLength(3)]],
      sku: ['', [Validators.required]],
      categorie: ['', [Validators.required]],
      price_usd: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]],
      resumen: ['', [Validators.required]],
      tags: [''],
      type_inventario: [1, [Validators.required]],
      state: [1]
    });

    this.variedadForm = this.fb.group({
      _id: [''],
      product: [''],
      valor: ['', [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos() {
    this.loading = true;
    this.productService.list(this.busqueda, this.categoriaFiltro).subscribe({
      next: (response) => {
        this.productos = response.products;
        this.productosFiltrados = this.productos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
        this.loading = false;
      }
    });
  }

  cargarCategorias() {
    this.categorieService.list().subscribe({
      next: (response) => {
        this.categorias = response.categories;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  buscarProducto() {
    this.cargarProductos();
  }

  filtrarPorCategoria() {
    this.cargarProductos();
  }

  abrirModal(producto?: Product) {
    this.isEditing = !!producto;
    this.showModal = true;
    this.portadaPreview = null;
    this.portadaFile = null;

    if (producto) {
      this.currentProduct = producto;
      const categorieId = typeof producto.categorie === 'object' ? producto.categorie._id : producto.categorie;
      this.productForm.patchValue({
        _id: producto._id,
        title: producto.title,
        sku: producto.sku,
        categorie: categorieId,
        price_usd: producto.price_usd,
        stock: producto.stock,
        description: producto.description,
        resumen: producto.resumen,
        tags: producto.tags,
        type_inventario: producto.type_inventario,
        state: producto.state
      });
      this.portadaPreview = producto.imagen || null;
    } else {
      this.productForm.reset({ type_inventario: 1, state: 1 });
    }
  }

  cerrarModal() {
    this.showModal = false;
    this.isEditing = false;
    this.currentProduct = null;
    this.productForm.reset({ type_inventario: 1, state: 1 });
    this.portadaPreview = null;
    this.portadaFile = null;
  }

  seleccionarPortada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.portadaFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.portadaPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarProducto() {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (!this.isEditing && !this.portadaFile) {
      Swal.fire('Error', 'Debes seleccionar una imagen de portada', 'error');
      return;
    }

    this.loading = true;

    const formData = new FormData();
    Object.keys(this.productForm.value).forEach(key => {
      if (key !== '_id' || this.isEditing) {
        formData.append(key, this.productForm.value[key]);
      }
    });
    
    if (this.portadaFile) {
      formData.append('portada', this.portadaFile);
    }

    if (this.isEditing) {
      this.productService.update(formData).subscribe({
        next: (response) => {
          Swal.fire('¡Éxito!', 'Producto actualizado correctamente', 'success');
          this.cerrarModal();
          this.cargarProductos();
        },
        error: (error) => {
          Swal.fire('Error', error.error.message || 'No se pudo actualizar el producto', 'error');
          this.loading = false;
        }
      });
    } else {
      this.productService.register(formData).subscribe({
        next: (response) => {
          Swal.fire('¡Éxito!', 'Producto registrado correctamente', 'success');
          this.cerrarModal();
          this.cargarProductos();
        },
        error: (error) => {
          Swal.fire('Error', error.error.message || 'No se pudo registrar el producto', 'error');
          this.loading = false;
        }
      });
    }
  }

  eliminarProducto(producto: Product) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el producto ${producto.title}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && producto._id) {
        this.loading = true;
        this.productService.delete(producto._id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El producto ha sido eliminado', 'success');
            this.cargarProductos();
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
            this.loading = false;
          }
        });
      }
    });
  }

  // Gestión de Variedades
  abrirModalVariedades(producto: Product) {
    this.currentProduct = producto;
    this.showVariedadModal = true;
    this.variedadForm.patchValue({ product: producto._id });
    this.cargarVariedades();
  }

  cerrarModalVariedades() {
    this.showVariedadModal = false;
    this.variedadForm.reset();
    this.isEditingVariedad = false;
    this.variedades = [];
  }

  cargarVariedades() {
    if (this.currentProduct && this.currentProduct._id) {
      this.productService.show(this.currentProduct._id).subscribe({
        next: (response) => {
          this.variedades = response.product.variedades || [];
        },
        error: (error) => {
          console.error('Error al cargar variedades:', error);
        }
      });
    }
  }

  guardarVariedad() {
    if (this.variedadForm.invalid) {
      Swal.fire('Error', 'Complete todos los campos', 'error');
      return;
    }
  
    this.loading = true;
  
    const variedadData = { ...this.variedadForm.value };
  
    if (!this.isEditingVariedad) {
      delete variedadData._id;
    }
  
    if (this.isEditingVariedad) {
      // Actualizar variedad existente
      this.productService.updateVariedad(variedadData).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire('Éxito', 'Variedad actualizada correctamente', 'success');
          this.variedadForm.reset({ product: this.currentProduct?._id });
          this.isEditingVariedad = false;
          this.cargarVariedades();
        },
        error: (error) => {
          console.error('Error al actualizar variedad:', error);
          this.loading = false;
          Swal.fire('Error', 'No se pudo actualizar la variedad', 'error');
        }
      });
    } else {
      // Registrar nueva variedad
      this.productService.registerVariedad(variedadData).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire('Éxito', 'Variedad registrada correctamente', 'success');
          this.variedadForm.reset({ product: this.currentProduct?._id });
          this.cargarVariedades();
        },
        error: (error) => {
          console.error('Error al registrar variedad:', error);
          this.loading = false;
          Swal.fire('Error', 'No se pudo registrar la variedad', 'error');
        }
      });
    }
  }

  editarVariedad(variedad: Variedad) {
    this.isEditingVariedad = true;
    this.variedadForm.patchValue(variedad);
  }

  eliminarVariedad(variedadId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar esta variedad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteVariedad(variedadId).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'Variedad eliminada', 'success');
            this.cargarVariedades();
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar la variedad', 'error');
          }
        });
      }
    });
  }

  // Gestión de Galería
  abrirModalGaleria(producto: Product) {
    this.currentProduct = producto;
    this.showGaleriaModal = true;
    this.galeriaPreview = null;
    this.galeriaFile = null;
  }

  cerrarModalGaleria() {
    this.showGaleriaModal = false;
    this.currentProduct = null;
    this.galeriaPreview = null;
    this.galeriaFile = null;
  }

  seleccionarImagenGaleria(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.galeriaFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.galeriaPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  agregarImagenGaleria() {
    if (!this.galeriaFile || !this.currentProduct) {
      Swal.fire('Error', 'Debes seleccionar una imagen', 'error');
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('_id', this.currentProduct._id!);
    formData.append('imagen', this.galeriaFile);

    this.productService.registerImagen(formData).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Imagen agregada a la galería', 'success');
        this.galeriaFile = null;
        this.galeriaPreview = null;
        this.cargarProductos();
        if (this.currentProduct && this.currentProduct._id) {
          this.productService.show(this.currentProduct._id).subscribe({
            next: (response) => {
              this.currentProduct = response.product;
              this.loading = false;
            },
            error: () => {
              this.loading = false;
            }
          });
        }
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo agregar la imagen', 'error');
        this.loading = false;
      }
    });
  }

  eliminarImagenGaleria(imagenId: string) {
    if (!this.currentProduct) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar esta imagen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && this.currentProduct) {
        this.productService.removeImagen({
          _id: this.currentProduct._id,
          imagen_id: imagenId
        }).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'Imagen eliminada', 'success');
            this.cargarProductos();
            if (this.currentProduct && this.currentProduct._id) {
              this.productService.show(this.currentProduct._id).subscribe({
                next: (response) => {
                  this.currentProduct = response.product;
                }
              });
            }
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo eliminar la imagen', 'error');
          }
        });
      }
    });
  }

  obtenerColorEstado(estado?: number): string {
    return estado === 1 ? 'bg-yellow-100 text-yellow-800' : estado === 2 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  obtenerTextoEstado(estado?: number): string {
    return estado === 1 ? 'Borrador' : estado === 2 ? 'Publicado' : 'Anulado';
  }

  getNombreCategoria(categorie: any): string {
    if (typeof categorie === 'object' && categorie !== null) {
      return categorie.title;
    }
    return 'Sin categoría';
  }
}