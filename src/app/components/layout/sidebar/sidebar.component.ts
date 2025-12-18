import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  menuItems = [
    {
      title: 'Dashboard',
      icon: 'fa-chart-line',
      route: '/dashboard',
      expanded: false
    },
    {
      title: 'Usuarios',
      icon: 'fa-users',
      route: '/users',
      expanded: false
    },
    {
      title: 'Productos',
      icon: 'fa-box',
      route: '/products',
      expanded: false,
      submenu: [
        { title: 'Lista de Productos', route: '/products' },
        { title: 'Categorías', route: '/categories' }
      ]
    },
    {
      title: 'Promociones',
      icon: 'fa-tags',
      route: '#',
      expanded: false,
      submenu: [
        { title: 'Descuentos', route: '/discounts' },
        { title: 'Cupones', route: '/cupones' }
      ]
    },
    {
      title: 'Ventas',
      icon: 'fa-shopping-cart',
      route: '/sales',
      expanded: false,
      badge: 'Nuevo',
      badgeColor: 'bg-green-500'
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleSubmenu(item: any) {
    if (item.submenu) {
      item.expanded = !item.expanded;
    }
  }
}