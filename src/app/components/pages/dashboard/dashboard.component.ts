import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  // Estadísticas
  totalVentas = 25800;
  totalProductos = 145;
  totalClientes = 892;
  pedidosPendientes = 23;

  // Configuración de gráfico de ventas
  public lineChartData: ChartData<'line'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [12000, 19000, 15000, 25000, 22000, 30000, 25800],
        label: 'Ventas 2025',
        fill: true,
        tension: 0.4,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
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
    }
  };

  public lineChartType: ChartType = 'line';

  // Configuración de gráfico de productos
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Electrónicos', 'Ropa', 'Hogar', 'Deportes'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']
      }
    ]
  };

  public doughnutChartType: ChartType = 'doughnut';

  // Últimos pedidos
  ultimosPedidos = [
    { id: '#ORD-001', cliente: 'Juan Pérez', total: 250, estado: 'Pendiente', fecha: '08/12/2025' },
    { id: '#ORD-002', cliente: 'María García', total: 180, estado: 'Completado', fecha: '08/12/2025' },
    { id: '#ORD-003', cliente: 'Carlos López', total: 420, estado: 'Procesando', fecha: '07/12/2025' },
    { id: '#ORD-004', cliente: 'Ana Martínez', total: 95, estado: 'Completado', fecha: '07/12/2025' },
    { id: '#ORD-005', cliente: 'Pedro Sánchez', total: 310, estado: 'Pendiente', fecha: '06/12/2025' }
  ];

  // Productos más vendidos
  productosMasVendidos = [
    { nombre: 'Laptop HP 15"', ventas: 156, imagen: 'https://via.placeholder.com/50' },
    { nombre: 'Mouse Logitech', ventas: 234, imagen: 'https://via.placeholder.com/50' },
    { nombre: 'Teclado Mecánico', ventas: 189, imagen: 'https://via.placeholder.com/50' },
    { nombre: 'Monitor Samsung 24"', ventas: 145, imagen: 'https://via.placeholder.com/50' }
  ];

  ngOnInit() {
    // Aquí puedes cargar datos reales desde tu backend
  }

  obtenerColorEstado(estado: string): string {
    const colores: any = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Procesando': 'bg-blue-100 text-blue-800',
      'Completado': 'bg-green-100 text-green-800',
      'Cancelado': 'bg-red-100 text-red-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  }
}