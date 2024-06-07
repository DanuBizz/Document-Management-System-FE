import { documentReducer, initialState } from './document.reducers';
import { documentActions } from './document.actions';
import { DocumentRequestInterface } from '../../../admin-view/type/document-request.interface';
import { DocumentVersionsResponseInterface } from '../../../admin-view/type/document-versions-response.interface';
import { PaginationConfigService } from '../../service/pagination-config.service';

describe('DocumentReducers', () => {
  const paginationConfigService = new PaginationConfigService();

  const queryParams = {
    pageNumber: paginationConfigService.getInitialPageIndex(),
    pageSize: paginationConfigService.getInitialPageSize(),
    sort: paginationConfigService.getInitialSort(),
    search: '',
  };

  it('returns a default state', () => {
    const action = { type: 'UNKNOWN' };
    const state = documentReducer(initialState, action);
    const newState = {
      ...initialState,
    };

    expect(state).toEqual(newState);
  });

  it('should change the state for get documents with query', () => {
    const action = documentActions.getDocumentsWithQuery({ queryParams: queryParams });
    const state = documentReducer(initialState, action);
    const newState = {
      ...initialState,
      isLoading: true,
      queryParams: action.queryParams,
    };

    expect(state).toEqual(newState);
  });

  it('should get documents and totalElements when success', () => {
    const documents: DocumentVersionsResponseInterface[] = [
      {
        id: 1,
        documentName: 'Document 1',
        filePath: '/path/to/document1',
        timestamp: new Date(),
        categoryNames: ['Category 1'],
        isRead: true,
        isLatest: true,
        isVisible: true,
        oldVersions: [],
      },
    ];
    const totalElements = '1';

    const action = documentActions.getDocumentsWithQuerySuccess({ documents: documents, totalElements: totalElements });
    const state = documentReducer(initialState, action);
    const newState = {
      ...initialState,
      data: documents,
      totalElements: totalElements,
    };

    expect(state).toEqual(newState);
  });

  it('should get documents with query failure', () => {
    const action = documentActions.getDocumentsWithQueryFailure({
      error: { ['error500']: ['Server error'] },
    });
    const state = documentReducer(initialState, action);
    const newState = {
      ...initialState,
      error: { ['error500']: ['Server error'] },
    };

    expect(state).toEqual(newState);
  });

  it('should set isSubmitting to true when createDocumentVersion is called', () => {
    const document: DocumentRequestInterface = {
      file: new File([''], 'dummy-file.txt'),
      name: 'Document 1',
      timestamp: new Date(),
      categoryIds: [1, 2],
    };

    const action = documentActions.createDocumentVersion({ doc: document });
    const state = documentReducer(initialState, action);
    const newState = {
      ...initialState,
      isSubmitting: true,
    };

    expect(state).toEqual(newState);
  });

  it('should set isSubmitting to false when createDocumentVersionSuccess is called', () => {
    const action = documentActions.createDocumentVersionSuccess({ emailSent: true });
    const state = documentReducer(initialState, action);
    const newState = {
      ...initialState,
      isSubmitting: false,
    };

    expect(state).toEqual(newState);
  });

  it('should set isSubmitting to false and error when createDocumentVersionFailure is called', () => {
    const error = { ['error500']: ['Server error'] };
    const action = documentActions.createDocumentVersionFailure({ error: error });
    const state = documentReducer(initialState, action);
    const newState = {
      ...initialState,
      isSubmitting: false,
      error: error,
    };

    expect(state).toEqual(newState);
  });

  it('should set isSubmitting to true when changeDocumentVisibility is called', () => {
    const action = documentActions.changeDocumentVisibility({ id: 1 });
    const state = documentReducer(initialState, action);
    const newState = {
      ...initialState,
      isSubmitting: true,
    };

    expect(state).toEqual(newState);
  });

  it('should set isSubmitting to false when changeDocumentVisibilitySuccess is called', () => {
    const action = documentActions.changeDocumentVisibilitySuccess();
    const state = documentReducer(initialState, action);
    const newState = {
      ...initialState,
      isSubmitting: false,
    };

    expect(state).toEqual(newState);
  });

  it('should set isSubmitting to false and error when changeDocumentVisibilityFailure is called', () => {
    const error = { ['error500']: ['Server error'] };
    const action = documentActions.changeDocumentVisibilityFailure({ error: error });
    const state = documentReducer(initialState, action);
    const newState = {
      ...initialState,
      isSubmitting: false,
      error: error,
    };

    expect(state).toEqual(newState);
  });
});
