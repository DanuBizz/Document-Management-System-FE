import { Routes } from '@angular/router';
import { AuthGuard } from './shared/service/auth-guard.service';
import { AdminGuard } from './shared/service/admin-guard.service';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then(m => m.LOGIN_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-view/admin.routes').then(r => r.ADMIN_ROUTES),
    canActivate: [AdminGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.routes').then(m => m.LOGIN_ROUTES),
  },
  {
    path: 'user',
    loadChildren: () => import('./user-view/user.routes').then(r => r.USER_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: 'forbidden',
    loadChildren: () => import('./page-not-permitted/page-not-permitted.routes').then(r => r.PAGE_NOT_PERMITTED_ROUTES),
  },
  {
    path: '**',
    loadChildren: () => import('./page-not-found/page-not-found.routes').then(r => r.PAGE_NOT_FOUND_ROUTES),
  },
];
