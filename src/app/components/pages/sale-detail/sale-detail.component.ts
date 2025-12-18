import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleService } from '../../../services/sale.service';
import { Sale, SaleDetail, SaleAddress } from '../../../models/sale.model';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-sale-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, FormsModule],
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.css']
})
export class SaleDetailComponent implements OnInit {
  sale: Sale | null = null;
  saleDetails: SaleDetail[] = [];
  saleAddress: SaleAddress | null = null;
  loading = false;
  saleId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private saleService: SaleService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.saleId = params['id'];
      if (this.saleId) {
        this.loadSaleDetail();
      }
    });
  }

  loadSaleDetail() {
    this.loading = true;
    this.saleService.show(this.saleId).subscribe({
      next: (response) => {
        this.sale = response.sale;
        this.saleDetails = response.sale_details;
        this.saleAddress = response.sale_address;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar detalle de venta:', error);
        this.notification.error('Error al cargar el detalle de la venta');
        this.loading = false;
        this.router.navigate(['/sales']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/sales']);
  }

  getProductImage(detail: SaleDetail): string {
    
    if (detail.product.imagen && detail.product.imagen.startsWith('http')) {
      return detail.product.imagen;
    }
    
    if (detail.product.imagen) {
      return `http://localhost:3000/api/products/uploads/product/${detail.product.imagen}`;
    }
    
    return 'https://via.placeholder.com/100?text=No+Image';
  }

  getPrecioConDescuento(detail: SaleDetail): number {
    // total / cantidad = precio final unitario
    return detail.total / detail.cantidad;
  }
  
  getMontoDescuento(detail: SaleDetail): number {
    return detail.subtotal - detail.total;
  }
  
  hasDiscount(detail: SaleDetail): boolean {
    return detail.type_discount > 0 && detail.discount > 0;
  }
  
  hasCoupon(detail: SaleDetail): boolean {
    return !!detail.code_cupon;
  }
  
  getDiscountBadge(detail: SaleDetail): string {
    if (detail.type_discount === 1) {
      return `${detail.discount}% OFF`;
    } else if (detail.type_discount === 2) {
      return `-$${detail.discount}`;
    }
    return '';
  }

  getMethodPaymentBadge(method: string): string {
    const badges: any = {
      'PAYPAL': 'bg-blue-100 text-blue-800',
      'STRIPE': 'bg-purple-100 text-purple-800',
      'TRANSFERENCIA': 'bg-green-100 text-green-800',
      'EFECTIVO': 'bg-gray-100 text-gray-800'
    };
    return badges[method.toUpperCase()] || 'bg-gray-100 text-gray-800';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getTotalUnidades(): number {
    return this.saleDetails.reduce((sum, detail) => sum + detail.cantidad, 0);
  }

  getTotalDescuentos(): number {
    return this.saleDetails.filter(detail => this.hasDiscount(detail)).length;
  }
}