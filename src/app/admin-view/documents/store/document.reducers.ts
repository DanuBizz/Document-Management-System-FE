import { DocumentStateInterface } from '../../type/document-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { documentActions } from './document.actions';

// Initial state for the documents feature
export const initialState: DocumentStateInterface = {
  isLoading: false,
  error: null,
  data: [],
};

export const documentFeature = createFeature({
  name: 'document',
  // Reducer functions for the feature
  reducer: createReducer(
    initialState,
    on(documentActions.getDocuments, state => ({
      ...state,
      isLoading: true,
    })),
    on(documentActions.getDocumentsSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      data: action.document,
    })),
    on(documentActions.getDocumentsFailure, (state, action) => ({
      ...state,
      isLoading: false,
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
  selectIsLoading,
  selectError,
  selectData: selectDocumentData,
} = documentFeature;
