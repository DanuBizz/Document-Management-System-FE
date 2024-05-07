import { CategoryStateInterface } from '../../type/category-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { categoryActions } from './category.actions';
import { PaginationConfigService } from '../../../shared/service/pagination-config.service';
import { routerNavigatedAction } from '@ngrx/router-store';

const paginationConfigService = new PaginationConfigService();

// Initial state for the categories feature
export const initialState: CategoryStateInterface = {
  isSubmitting: false,
  isLoading: false,
  error: null,
  data: [],
  totalElements: '0',
  pageSizeOptions: paginationConfigService.getPageSizeOptions(),
  pagination: {
    pageNumber: paginationConfigService.getInitialPageIndex(),
    pageSize: paginationConfigService.getInitialPageSize(),
    sort: paginationConfigService.getInitialSort(),
  },
};

export const categoriesFeature = createFeature({
  name: 'categories',
  // Reducer functions for the feature
  reducer: createReducer(
    initialState,
    on(categoryActions.getAllCategories, state => ({
      ...state,
      isLoading: true,
    })),
    on(categoryActions.getAllCategoriesSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      data: action.category,
    })),
    on(categoryActions.getAllCategoriesFailure, (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error,
    })),

    on(categoryActions.getCategoriesWithQuery, (state, action) => ({
      ...state,
      isLoading: true,
      pagination: action.pagination,
    })),
    on(categoryActions.getCategoriesWithQuerySuccess, (state, { categories, totalElements }) => ({
      ...state,
      isLoading: false,
      data: categories,
      totalElements: totalElements,
    })),
    on(categoryActions.getCategoriesWithQueryFailure, (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error,
    })),

    on(categoryActions.createCategory, state => ({
      ...state,
      isSubmitting: true,
    })),
    on(categoryActions.createCategorySuccess, state => ({
      ...state,
      isSubmitting: false,
    })),
    on(categoryActions.createCategoryFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      error: action.error,
    })),
    // Handling router navigated action

    on(routerNavigatedAction, state => ({
      ...state,
      data: [],
    }))
  ),
});

// Extracting necessary values from the categories feature
export const {
  name: categoryFeatureKey,
  reducer: categoryReducer,
  selectIsSubmitting: selectCategoryIsSubmitting,
  selectIsLoading: selectCategoryIsLoading,
  selectError: selectCategoryError,
  selectData: selectCategoryData,
  selectTotalElements: selectCategoryTotalElements,
  selectPageSizeOptions: selectCategoryPageSizeOptions,
  selectPagination: selectCategoryPagination,
} = categoriesFeature;
