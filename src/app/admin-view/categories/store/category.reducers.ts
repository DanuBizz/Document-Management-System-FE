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
  queryParams: {
    pageNumber: paginationConfigService.getInitialPageIndex(),
    pageSize: paginationConfigService.getInitialPageSize(),
    sort: paginationConfigService.getInitialSort(),
    search: '',
  },
  areLoaded: false,
};

export const categoriesFeature = createFeature({
  name: 'categories',
  // Reducer functions for the feature
  reducer: createReducer<CategoryStateInterface>(
    initialState,

    // GET ALL

    on(
      categoryActions.getAllCategories,
      (state): CategoryStateInterface => ({
        ...state,
        isLoading: true,
      })
    ),
    on(
      categoryActions.getAllCategoriesSuccess,
      (state, action): CategoryStateInterface => ({
        ...state,
        isLoading: false,
        allData: action.category,
      })
    ),
    on(
      categoryActions.getAllCategoriesFailure,
      (state, action): CategoryStateInterface => ({
        ...state,
        isLoading: false,
        error: action.error,
      })
    ),

    // GET WITH QUERY

    on(
      categoryActions.getCategoriesWithQuery,
      (state, action): CategoryStateInterface => ({
        ...state,
        isLoading: true,
        queryParams: action.queryParams,
      })
    ),
    on(
      categoryActions.getCategoriesWithQuerySuccess,
      (state, { categories, totalElements }): CategoryStateInterface => ({
        ...state,
        isLoading: false,
        tableData: categories,
        totalElements: totalElements,
        areLoaded: true,
      })
    ),
    on(
      categoryActions.getCategoriesWithQueryFailure,
      (state, action): CategoryStateInterface => ({
        ...state,
        isLoading: false,
        error: action.error,
        areLoaded: false,
      })
    ),

    // CREATE CATEGORY

    on(
      categoryActions.createCategory,
      (state): CategoryStateInterface => ({
        ...state,
        isSubmitting: true,
      })
    ),
    on(
      categoryActions.createCategorySuccess,
      (state): CategoryStateInterface => ({
        ...state,
        isSubmitting: false,
      })
    ),
    on(
      categoryActions.createCategoryFailure,
      (state, action): CategoryStateInterface => ({
        ...state,
        isSubmitting: false,
        error: action.error,
      })
    ),

    // UPDATE CATEGORY

    on(
      categoryActions.updateCategory,
      (state): CategoryStateInterface => ({
        ...state,
        isSubmitting: true,
      })
    ),
    on(
      categoryActions.updateCategorySuccess,
      (state): CategoryStateInterface => ({
        ...state,
        isSubmitting: false,
      })
    ),
    on(
      categoryActions.updateCategoryFailure,
      (state, action): CategoryStateInterface => ({
        ...state,
        isSubmitting: false,
        error: action.error,
      })
    )

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
  selectQueryParams: selectCategoryQueryParams,
  selectAreLoaded: selectCategoryAreLoaded,
} = categoriesFeature;
