import { DocumentStateInterface } from '../../type/document-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { documentActions } from './document.actions';
import { PaginationConfigService } from '../../../shared/service/pagination-config.service';

const paginationConfigService = new PaginationConfigService();

// Initial state for the documents feature
export const initialState: DocumentStateInterface = {
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
        pagination: action.pagination,
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
    )
    /*
    on(routerNavigatedAction, () => (initialState))
    */
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
  selectPagination: selectDocumentPagination,
  selectAreLoaded: selectDocumentAreLoaded,
} = documentFeature;
