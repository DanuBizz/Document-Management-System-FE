import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./admin-view/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  {
    path: 'admin',
    loadChildren: () => import('./admin-view/admin.routes').then(r => r.ADMIN_ROUTES),
  },

];
