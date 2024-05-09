import { DocCategoryStateInterface } from '../../type/doc-category-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { docCategoryActions } from './doc-category.actions';

// Initial state for the docCategories feature
export const initialState: DocCategoryStateInterface = {
  isLoading: false,
  error: null,
  data: [],
};

export const docCategoryFeature = createFeature({
  name: 'doc-category',
  // Reducer functions for the feature
  reducer: createReducer(
    initialState,
    on(docCategoryActions.getAllDocumentCategories, state => ({
      ...state,
      isLoading: true,
    })),
    on(docCategoryActions.getAllDocumentCategoriesSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      data: action.docCategory,
    })),
    on(docCategoryActions.getAllDocumentCategoriesFailure, (state, action) => ({
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

// Extracting necessary values from the feature
export const {
  name: docCategoryFeatureKey,
  reducer: docCategoryReducer,
  selectIsLoading: selectDocCategoryIsLoading,
  selectError: selectDocCategoryError,
  selectData: selectDocCategoryData,
} = docCategoryFeature;
