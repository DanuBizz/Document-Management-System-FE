import { DocumentStateInterface } from '../../type/document-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { documentActions } from './document.actions';
import { PaginationConfigService } from '../../../shared/service/pagination-config.service';
import { routerNavigatedAction } from '@ngrx/router-store';

const paginationConfigService = new PaginationConfigService();

// Initial state for the documents feature
export const initialState: DocumentStateInterface = {
  isSubmitting: false,
  isLoading: false,
  error: null,
  data: [],
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

export const documentFeature = createFeature({
  name: 'document-admin',
  // Reducer functions for the feature
  reducer: createReducer<DocumentStateInterface>(
    initialState,
    on(
      documentActions.getDocumentsWithQuery,
      (state, action): DocumentStateInterface => ({
        ...state,
        isLoading: true,
        queryParams: action.queryParams,
      })
    ),
    on(
      documentActions.getDocumentsWithQuerySuccess,
      (state, { documents, totalElements }): DocumentStateInterface => ({
        ...state,
        isLoading: false,
        data: documents,
        totalElements: totalElements,
        areLoaded: true,
      })
    ),
    on(
      documentActions.getDocumentsWithQueryFailure,
      (state, action): DocumentStateInterface => ({
        ...state,
        isLoading: false,
        error: action.error,
        areLoaded: false,
      })
    ),

    on(
      documentActions.createDocumentVersion,
      (state): DocumentStateInterface => ({
        ...state,
        isSubmitting: true,
      })
    ),
    on(
      documentActions.createDocumentVersionSuccess,
      (state): DocumentStateInterface => ({
        ...state,
        isSubmitting: false,
      })
    ),
    on(
      documentActions.createDocumentVersionFailure,
      (state, action): DocumentStateInterface => ({
        ...state,
        isSubmitting: false,
        error: action.error,
      })
    ),

    on(
      documentActions.changeDocumentVisibility,
      (state): DocumentStateInterface => ({
        ...state,
        isSubmitting: true,
      })
    ),
    on(
      documentActions.changeDocumentVisibilitySuccess,
      (state): DocumentStateInterface => ({
        ...state,
        isSubmitting: false,
      })
    ),
    on(
      documentActions.changeDocumentVisibilityFailure,
      (state, action): DocumentStateInterface => ({
        ...state,
        isSubmitting: false,
        error: action.error,
      })
    ),

    // Handling router navigated action
    on(routerNavigatedAction, (state, action): DocumentStateInterface => {
      if (action.payload.routerState.url === '/login') {
        return initialState;
      }
      return state;
    })
  ),
});

// Extracting necessary values from the document feature
export const {
  name: documentFeatureKey,
  reducer: documentReducer,
  selectIsSubmitting: selectDocumentIsSubmitting,
  selectIsLoading: selectDocumentIsLoading,
  selectError: selectDocumentError,
  selectData: selectDocumentData,
  selectTotalElements: selectDocumentTotalElements,
  selectPageSizeOptions: selectDocumentPageSizeOptions,
  selectQueryParams: selectDocumentQueryParams,
  selectAreLoaded: selectDocumentAreLoaded,
} = documentFeature;
