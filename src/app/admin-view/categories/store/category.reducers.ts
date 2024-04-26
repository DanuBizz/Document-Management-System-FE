import { CategoryStateInterface } from '../../type/category-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { categoryActions } from './category.actions';

// Initial state for the categories feature
export const initialState: CategoryStateInterface = {
  isLoading: false,
  error: null,
  data: [],
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
    }))
    // Handling router navigated action
    /*
    on(routerNavigatedAction, () => (initialState))
    */
  ),
});

// Extracting necessary values from the categories feature
export const {
  name: categoryFeatureKey,
  reducer: categoryReducer,
  selectIsLoading,
  selectError,
  selectData: selectCategoryData,
} = categoriesFeature;
