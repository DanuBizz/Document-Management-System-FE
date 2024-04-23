import { documentReducer, initialState } from './document.reducers';
import { documentActions } from './document.actions';
import { DocumentResponseInterface } from '../../type/document-response.interface';

describe('DocumentReducers', () => {
  it('returns a default state', () => {
    const action = { type: 'UNKNOWN' };
    const state = documentReducer(initialState, action);
    const newState = {
      error: null,
      isLoading: false,
      data: [],
    };

    expect(state).toEqual(newState);
  });

  it('should get documents', () => {
    const action = documentActions.getDocuments();
    const state = documentReducer(initialState, action);
    const newState = {
      error: null,
      isLoading: true,
      data: [],
    };

    expect(state).toEqual(newState);
  });

  it('should get documents success', () => {
    const documents: DocumentResponseInterface[] = [
      {
        id: 10,
        name: 'test',
        filePath: 'asdf',
        categoryIds: [1, 2, 3],
        read: false,
        visible: true,
      },
    ];

    const action = documentActions.getDocumentsSuccess({
      document: documents,
    });
    const state = documentReducer(initialState, action);
    const newState = {
      error: null,
      isLoading: false,
      data: documents,
    };

    expect(state).toEqual(newState);
  });

  it('should get documents failure', () => {
    const action = documentActions.getDocumentsFailure({
      error: { ['error500']: ['Server error'] },
    });
    const state = documentReducer(initialState, action);
    const newState = {
      error: { ['error500']: ['Server error'] },
      isLoading: false,
      data: [],
    };

    expect(state).toEqual(newState);
  });
});
