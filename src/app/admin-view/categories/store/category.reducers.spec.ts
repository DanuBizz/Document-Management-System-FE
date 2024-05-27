import { categoryReducer, initialState } from './category.reducers';
import { categoryActions } from './category.actions';
import { CategoryResponseInterface } from '../../type/category-response.interface';
import { CategoryRequestInterface } from '../../type/category-request.interface';
import { QueryParamsInterface } from '../../../shared/type/query-params.interface';

describe('CategoryReducers', () => {
  const pagination: QueryParamsInterface = {
    pageNumber: '0',
    pageSize: '5',
    sort: '',
  };

  it('returns a default state', () => {
    const action = { type: 'UNKNOWN' };
    const state = categoryReducer(initialState, action);
    const newState = {
      ...initialState,
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
          userNames: ['user1', 'user2'],
          userIds: [1],
        },
      ],
    });
    const state = categoryReducer(initialState, action);
    const newState = {
      ...initialState,
      allData: [
        {
          id: 10,
          name: 'test',
          userNames: ['user1', 'user2'],
          userIds: [1],
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

  it('get category with query', () => {
    const action = categoryActions.getCategoriesWithQuery({ queryParams: pagination });
    const state = categoryReducer(initialState, action);
    const newState = {
      ...initialState,
      isLoading: true,
      pagination: pagination,
    };

    expect(state).toEqual(newState);
  });

  it('get categories with query success', () => {
    const categories: CategoryResponseInterface[] = [
      {
        id: 10,
        name: 'test',
        userNames: ['user1', 'user2'],
        userIds: [1],
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
      tableData: categories,
      totalElements: totalElements,
    };

    expect(state).toEqual(newState);
  });

  it('get categories with query failure', () => {
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

  it('create Category', () => {
    const category: CategoryRequestInterface = {
      name: 'test',
      userIds: [1, 3],
    };
    const action = categoryActions.createCategory({ category });
    const state = categoryReducer(initialState, action);
    const newState = {
      ...initialState,
      isSubmitting: true,
    };
    expect(state).toEqual(newState);
  });

  it('create category success', () => {
    const action = categoryActions.createCategorySuccess({
      message: 'success',
    });
    const state = categoryReducer(initialState, action);
    const newState = {
      ...initialState,
      isSubmitting: false,
    };
    expect(state).toEqual(newState);
  });

  it('get categories with query failure', () => {
    const action = categoryActions.createCategoryFailure({
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
