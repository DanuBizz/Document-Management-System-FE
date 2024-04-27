import { documentReducer, initialState } from './document.reducers';
import { documentActions } from './document.actions';
import { DocumentResponseInterface } from '../../type/document-response.interface';
import {PaginationQueryParamsInterface} from "../../../shared/type/pagination-query-params.interface";


describe('DocumentReducers', () => {

    const requestParams: PaginationQueryParamsInterface = {
        pageNumber: '0',
        pageSize: '5'
    };

 it('returns a default state', () => {
   const action = { type: 'UNKNOWN' };
   const state = documentReducer(initialState, action);
   const newState = {
     error: null,
     isLoading: false,
     data: [],
     totalElements: '0'
   };

   expect(state).toEqual(newState);
 });

 it('should change the state for get documents with query', () => {
   const action = documentActions.getDocumentsWithQuery({queryParams: requestParams});
   const state = documentReducer(initialState, action);
   const newState = {
     ...initialState,
        isLoading: true,
   };

   expect(state).toEqual(newState);
 });

 it('should get documents and totalElements when success', () => {
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
   const totalElements = '1';

   const action = documentActions.getDocumentsWithQuerySuccess(
       { documents: documents, totalElements: totalElements});
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


});


