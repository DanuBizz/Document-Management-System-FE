import { categoryReducer, initialState } from './category.reducers';
import { categoryActions } from './category.actions';
import { PaginationQueryParamsInterface } from '../../../shared/type/pagination-query-params.interface';
import { CategoryResponseInterface } from '../../type/category-response.interface';

describe('CategoryReducers', () => {
  const requestParams: PaginationQueryParamsInterface = {
    pageNumber: '0',
    pageSize: '5',
  };

  it('returns a default state', () => {
    const action = { type: 'UNKNOWN' };
    const state = categoryReducer(initialState, action);
    const newState = {
      error: null,
      isLoading: false,
      data: [],
      totalElements: '0',
    };

    expect(state).toEqual(newState);
  });

  it('get all categories', () => {
    const action = categoryActions.getAllCategories();
    const state = categoryReducer(initialState, action);
    const newState = {
      ...initialState,
      isLoading: true,
    };

    expect(state).toEqual(newState);
  });

  it('get all categories success', () => {
    const action = categoryActions.getAllCategoriesSuccess({
      category: [
        {
          id: 10,
          name: 'test',
        },
      ],
    });
    const state = categoryReducer(initialState, action);
    const newState = {
      ...initialState,
      data: [
        {
          id: 10,
          name: 'test',
        },
      ],
    };

    expect(state).toEqual(newState);
  });

  it('get all categories failure', () => {
    const action = categoryActions.getAllCategoriesFailure({
      error: { ['error500']: ['Server error'] },
    });
    const state = categoryReducer(initialState, action);
    const newState = {
      ...initialState,
      error: { ['error500']: ['Server error'] },
    };

    expect(state).toEqual(newState);
  });

  it('should change the state for get category with query', () => {
    const action = categoryActions.getCategoriesWithQuery({ queryParams: requestParams });
    const state = categoryReducer(initialState, action);
    const newState = {
      ...initialState,
      isLoading: true,
    };

    expect(state).toEqual(newState);
  });

  it('should get categories and totalElements when success', () => {
    const categories: CategoryResponseInterface[] = [
      {
        id: 10,
        name: 'test',
      },
    ];
    const totalElements = '1';

    const action = categoryActions.getCategoriesWithQuerySuccess({
      categories: categories,
      totalElements: totalElements,
    });
    const state = categoryReducer(initialState, action);
    const newState = {
      ...initialState,
      data: categories,
      totalElements: totalElements,
    };

    expect(state).toEqual(newState);
  });

  it('should get categories with query failure', () => {
    const action = categoryActions.getCategoriesWithQueryFailure({
      error: { ['error500']: ['Server error'] },
    });
    const state = categoryReducer(initialState, action);
    const newState = {
      ...initialState,
      error: { ['error500']: ['Server error'] },
    };

    expect(state).toEqual(newState);
  });
});
