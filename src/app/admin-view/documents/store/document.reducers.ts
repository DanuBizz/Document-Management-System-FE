import { DocumentStateInterface } from '../../type/document-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { documentActions } from './document.actions';

// Initial state for the documents feature
export const initialState: DocumentStateInterface = {
  isLoading: false,
  error: null,
  data: [],
  totalElements: '0',
};

export const documentFeature = createFeature({
  name: 'document',
  // Reducer functions for the feature
  reducer: createReducer(
    initialState,
    on(documentActions.getDocumentsWithQuery, state => ({
      ...state,
      isLoading: true,
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
      isLoading: true,
    })),
    on(documentActions.createDocumentVersionSuccess, state => ({
      ...state,
      isLoading: false,
    })),
    on(documentActions.createDocumentVersionFailure, state => ({
      ...state,
      isLoading: false,
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
  selectIsLoading,
  selectError,
  selectData: selectDocumentData,
  selectTotalElements,
} = documentFeature;
