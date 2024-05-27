import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then(m => m.LOGIN_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-view/admin.routes').then(r => r.ADMIN_ROUTES),
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.routes').then(m => m.LOGIN_ROUTES),
  },
  {
    path: 'user',
    loadChildren: () => import('./user-view/user.routes').then(r => r.USER_ROUTES),
  },
  {
    path: '**',
    loadChildren: () => import('./page-not-found/page-not-found.routes').then(r => r.PAGE_NOT_FOUND_ROUTES),
  },
];
