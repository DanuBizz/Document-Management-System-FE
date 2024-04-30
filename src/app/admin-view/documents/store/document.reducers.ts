import { DocumentStateInterface } from '../../type/document-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { documentActions } from './document.actions';

// Initial state for the documents feature
export const initialState: DocumentStateInterface = {
  isSubmitting: false,
  isLoading: false,
  error: null,
  data: [],
  totalElements: '0',
  queryParams: {
    pageNumber: '0',
    pageSize: '5',
  },
};

export const documentFeature = createFeature({
  name: 'document',
  // Reducer functions for the feature
  reducer: createReducer(
    initialState,
    on(documentActions.getDocumentsWithQuery, (state, action) => ({
      ...state,
      isLoading: true,
      queryParams: action.queryParams,
    })),
    on(documentActions.getDocumentsWithQuerySuccess, (state, { documents, totalElements }) => ({
      ...state,
      isLoading: false,
      data: documents,
      totalElements: totalElements,
    })),
    on(documentActions.getDocumentsWithQueryFailure, (state, action) => ({
      ...state,
      isLoading: false,
      error: action.error,
    })),

    on(documentActions.createDocumentVersion, state => ({
      ...state,
      isSubmitting: true,
    })),
    on(documentActions.createDocumentVersionSuccess, state => ({
      ...state,
      isSubmitting: false,
    })),
    on(documentActions.createDocumentVersionFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      error: action.error,
    }))
    /*
    on(routerNavigatedAction, () => (initialState))
    */
  ),
});

// Extracting necessary values from the document feature
export const {
  name: documentFeatureKey,
  reducer: documentReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectError,
  selectData: selectDocumentData,
  selectTotalElements,
  selectQueryParams,
} = documentFeature;
