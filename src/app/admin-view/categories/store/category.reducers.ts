import { CategoryStateInterface } from '../../type/category-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { categoryActions } from './category.actions';
import { PaginationConfigService } from '../../../shared/service/pagination-config.service';

const paginationConfigService = new PaginationConfigService();

// Initial state for the categories feature
export const initialState: CategoryStateInterface = {
  isSubmitting: false,
  isLoading: false,
  error: null,
  tableData: [],
  allData: [],
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

    // GET ALL

    on(categoryActions.getAllCategories, state => ({
      ...state,
      isLoading: true,
    })),
    on(categoryActions.getAllCategoriesSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      allData: action.category,
    })),
    on(categoryActions.getAllCategoriesFailure, (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error,
    })),

    // GET WITH QUERY

    on(categoryActions.getCategoriesWithQuery, (state, action) => ({
      ...state,
      isLoading: true,
      pagination: action.pagination,
    })),
    on(categoryActions.getCategoriesWithQuerySuccess, (state, { categories, totalElements }) => ({
      ...state,
      isLoading: false,
      tableData: categories,
      totalElements: totalElements,
    })),
    on(categoryActions.getCategoriesWithQueryFailure, (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error,
    })),

    // CREATE CATEGORY

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

    // UPDATE CATEGORY

    on(categoryActions.updateCategory, state => ({
      ...state,
      isSubmitting: true,
    })),
    on(categoryActions.updateCategorySuccess, state => ({
      ...state,
      isSubmitting: false,
    })),
    on(categoryActions.updateCategoryFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      error: action.error,
    }))

    // Handling router navigated action
    /*
    on(routerNavigatedAction, state => ({
      ...state,
      data: [],
    }))
      */
  ),
});

// Extracting necessary values from the categories feature
export const {
  name: categoryFeatureKey,
  reducer: categoryReducer,
  selectIsSubmitting: selectCategoryIsSubmitting,
  selectIsLoading: selectCategoryIsLoading,
  selectError: selectCategoryError,
  selectTableData: selectCategoryTableData,
  selectAllData: selectCategoryAllData,
  selectTotalElements: selectCategoryTotalElements,
  selectPageSizeOptions: selectCategoryPageSizeOptions,
  selectPagination: selectCategoryPagination,
} = categoriesFeature;
