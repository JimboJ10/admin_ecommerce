import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { SaleService } from '../../../services/sale.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, LoadingSpinnerComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  loading = false;

  // Estadísticas reales
  totalSales = 0;
  totalRevenue = 0;
  totalUsers = 0;
  totalProducts = 0;
  recentSales = 0;

  // Datos para gráficos
  salesByDay: any[] = [];
  topProducts: any[] = [];
  latestSales: any[] = [];

  // Configuración de gráfico de ventas
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ventas (Últimos 7 días)',
        fill: true,
        tension: 0.4,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      },
      {
        data: [],
        label: 'Ingresos (USD)',
        fill: true,
        tension: 0.4,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public lineChartType: ChartType = 'line';

  // Configuración de gráfico de productos por categoría
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']
      }
    ]
  };

  public doughnutChartType: ChartType = 'doughnut';

  constructor(
    private saleService: SaleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.loading = true;
    this.saleService.getStats().subscribe({
      next: (stats) => {

        // Actualizar estadísticas generales
        this.totalSales = stats.totalSales || 0;
        this.totalRevenue = stats.totalRevenue || 0;
        this.totalUsers = stats.totalUsers || 0;
        this.totalProducts = stats.totalProducts || 0;
        this.recentSales = stats.recentSales || 0;

        // Actualizar gráfico de ventas por día
        if (stats.salesByDay && stats.salesByDay.length > 0) {
          this.salesByDay = stats.salesByDay;
          this.lineChartData.labels = stats.salesByDay.map((d: any) => d.date);
          this.lineChartData.datasets[0].data = stats.salesByDay.map((d: any) => d.sales);
          this.lineChartData.datasets[1].data = stats.salesByDay.map((d: any) => d.revenue);
        }

        // Actualizar top productos
        if (stats.topProducts && stats.topProducts.length > 0) {
          this.topProducts = stats.topProducts.slice(0, 4);
        }

        // Actualizar últimas ventas
        if (stats.latestSales && stats.latestSales.length > 0) {
          this.latestSales = stats.latestSales;
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.loading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getProductImage(portada: string): string {
    if (portada) {
      return `http://localhost:3000/api/products/uploads/product/${portada}`;
    }
    return 'https://via.placeholder.com/50';
  }

  viewAllSales() {
    this.router.navigate(['/sales']);
  }

  viewAllProducts() {
    this.router.navigate(['/products']);
  }
}