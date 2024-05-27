import { DocCategoryStateInterface } from '../../type/doc-category-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { docCategoryActions } from './doc-category.actions';
import { routerNavigatedAction } from '@ngrx/router-store';

// Initial state for the docCategories feature
export const initialState: DocCategoryStateInterface = {
  isLoading: false,
  error: null,
  data: [],
};

export const docCategoryFeature = createFeature({
  name: 'doc-category',
  // Reducer functions for the feature
  reducer: createReducer<DocCategoryStateInterface>(
    initialState,
    on(
      docCategoryActions.getAllDocumentCategories,
      (state): DocCategoryStateInterface => ({
        ...state,
        isLoading: true,
      })
    ),
    on(
      docCategoryActions.getAllDocumentCategoriesSuccess,
      (state, action): DocCategoryStateInterface => ({
        ...state,
        isLoading: false,
        data: action.docCategory,
      })
    ),
    on(
      docCategoryActions.getAllDocumentCategoriesFailure,
      (state, action): DocCategoryStateInterface => ({
        ...state,
        isLoading: false,
        error: action.error,
      })
    ),

    // Handling router navigated action

    on(routerNavigatedAction, (state, action): DocCategoryStateInterface => {
      if (action.payload.routerState.url === '/login') {
        return initialState;
      }
      return state;
    })
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
