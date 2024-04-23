import {Routes} from "@angular/router";
import {CategoryManagementComponent} from "./categories/category-management/category-management.component";


export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'category',
    pathMatch: 'full',
  },
  {
    path: 'category',
    title: 'Category Management',
    component: CategoryManagementComponent,
  },
];
