import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SaleService } from '../../../services/sale.service';
import { Sale } from '../../../models/sale.model';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  loading = false;
  searchTerm = '';

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;

  Math = Math;

  constructor(
    private saleService: SaleService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.loading = true;
    this.saleService.listAll().subscribe({
      next: (response) => {
        this.sales = response.sales;
        this.filteredSales = this.sales;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
        this.notification.error('Error al cargar las ventas');
        this.loading = false;
      }
    });
  }

  filterSales() {
    if (!this.searchTerm.trim()) {
      this.filteredSales = this.sales;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredSales = this.sales.filter(sale =>
      sale.user.name.toLowerCase().includes(term) ||
      sale.user.email.toLowerCase().includes(term) ||
      sale.n_transacccion.toLowerCase().includes(term) ||
      sale.method_payment.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  viewSaleDetail(saleId: string) {
    this.router.navigate(['/sales', saleId]);
  }

  get totalRevenue(): number {
    return this.sales.reduce((sum, sale) => sum + sale.total, 0);
  }

  get averageTicket(): number {
    return this.sales.length > 0 ? this.totalRevenue / this.sales.length : 0;
  }

  get uniqueCustomers(): number {
    const uniqueIds = new Set(this.sales.map(sale => sale.user._id));
    return uniqueIds.size;
  }

  get paginatedSales() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredSales.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredSales.length / this.itemsPerPage);
  }

  get paginationRange(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
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
      month: 'short',
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
}