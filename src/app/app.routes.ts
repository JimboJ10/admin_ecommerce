import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/pages/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./components/pages/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./components/pages/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'cupones',
        loadComponent: () => import('./components/pages/cupones/cupones.component').then(m => m.CuponesComponent)
      },
      {
        path: 'discounts',
        loadComponent: () => import('./components/pages/discounts/discounts.component').then(m => m.DiscountsComponent)
      },
      {
        path: 'sales',
        loadComponent: () => import('./components/pages/sales/sales.component').then(m => m.SalesComponent)
      },
      {
        path: 'sales/:id',
        loadComponent: () => import('./components/pages/sale-detail/sale-detail.component').then(m => m.SaleDetailComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];