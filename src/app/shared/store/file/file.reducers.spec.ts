import { fileReducer, initialState } from './file.reducers';
import { fileActions } from './file.actions';

describe('FileReducers', () => {
  it('returns a default state', () => {
    const action = { type: 'UNKNOWN' };
    const state = fileReducer(initialState, action);
    const newState = {
      ...initialState,
    };

    expect(state).toEqual(newState);
  });

  it('should get file', () => {
    const action = fileActions.getFile({ id: 1 });
    const state = fileReducer(initialState, action);
    const newState = {
      ...initialState,
      isLoading: true,
    };

    expect(state).toEqual(newState);
  });

  it('should get filesuccess', () => {
    const file = [new File([''], 'filename', { type: 'text/html' })];

    const action = fileActions.getFileSuccess({ file: file });
    const state = fileReducer(initialState, action);
    const newState = {
      ...initialState,
      data: action.file,
    };

    expect(state).toEqual(newState);
  });

  it('should get all document categories failure', () => {
    const action = fileActions.getFileFailure({
      error: { ['error500']: ['Server error'] },
    });

    const state = fileReducer(initialState, action);
    const newState = {
      ...initialState,
      error: { ['error500']: ['Server error'] },
    };

    expect(state).toEqual(newState);
  });
});
