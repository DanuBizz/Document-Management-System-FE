import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FabButtonComponent } from '../../../shared/component/fab-button/fab-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { CategoryService } from '../../../shared/service/category.service';
import { combineLatest, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCategoryData, selectError, selectIsLoading } from '../store/category.reducers';
import { MatProgressBar } from '@angular/material/progress-bar';
import { openCreateCategoryDialog } from '../create-category-dialog/category-dialog.config';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FabButtonComponent,
    MatTooltip,
    MatCheckbox,
    MatPaginator,
    MatProgressBar,
  ],
  providers: [CategoryService],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss',
})
export class CategoryManagementComponent {
  title = 'Kategorie Management';

  // Observable combining necessary data from the store for the component
  data$ = combineLatest({
    category: this.store.select(selectCategoryData),
    isLoading: this.store.select(selectIsLoading),
    error: this.store.select(selectError),
  });

  // Columns to display in the table
  displayedColumns: string[] = ['id', 'name', 'users'];

  /**
   * @param store - The Redux store instance injected via dependency injection.
   * @param dialog - The MatDialog service for opening dialogs.
   */
  constructor(
    private store: Store,
    private dialog: MatDialog
  ) {}

  /**
   * Opens a dialog to create a new category.
   * This method is prepared but not fully implemented.
   */
  createNewCategory() {
    openCreateCategoryDialog(this.dialog)
      .pipe(filter(val => !!val))
      .subscribe(val => {
        console.log('New category value:', val);
      });
  }
}