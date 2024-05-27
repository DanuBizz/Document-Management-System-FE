import { createFeature, createReducer, on } from '@ngrx/store';
import { fileActions } from './file.actions';
import { FileStateInterface } from '../../type/file-state.interface';
import { routerNavigatedAction } from '@ngrx/router-store';

export const initialState: FileStateInterface = {
  data: null,
  error: null,
  isLoading: false,
};

export const fileFeature = createFeature({
  name: 'file',
  reducer: createReducer<FileStateInterface>(
    initialState,
    on(
      fileActions.getFile,
      (state): FileStateInterface => ({
        ...state,
        isLoading: true,
      })
    ),
    on(
      fileActions.getFileSuccess,
      (state, action): FileStateInterface => ({
        ...state,
        data: action.fileUrl,
        isLoading: false,
      })
    ),
    on(
      fileActions.getFileFailure,
      (state, action): FileStateInterface => ({
        ...state,
        isLoading: false,
        error: action.error,
      })
    ),

    on(routerNavigatedAction, (state, action): FileStateInterface => {
      if (action.payload.routerState.url === '/login') {
        return initialState;
      }
      return state;
    })
  ),
});

export const {
  name: fileFeatureKey,
  reducer: fileReducer,
  selectIsLoading: selectFileIsLoading,
  selectError: selectFileError,
  selectData: selectFileData,
} = fileFeature;
