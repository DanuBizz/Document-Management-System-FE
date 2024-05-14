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
    path: 'web-view',
    loadChildren: () => import('./web-view/web-view.routes').then(m => m.WEB_VIEW_ROUTES),
  },
  {
    path: 'user',
    loadChildren: () => import('./user-view/user.routes').then(r => r.USER_ROUTES),
  },
];
