import { GroupStateInterface } from '../../../type/group-state.inerface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { groupActions } from './group.actions';
import { PaginationConfigService } from '../../../../shared/service/pagination-config.service';

const paginationConfigService = new PaginationConfigService();

export const initialState: GroupStateInterface = {
  isSubmitting: false,
  isLoading: false,
  error: null,
  tableData: [],
  allData: [],
  totalElements: '0',
  pageSizeOptions: [],
  queryParams: {
    pageNumber: paginationConfigService.getInitialPageIndex(),
    pageSize: paginationConfigService.getInitialPageSize(),
    sort: paginationConfigService.getInitialSort(),
    search: '',
  },
  areLoaded: false,
};

export const groupFeature = createFeature({
  name: 'group',
  reducer: createReducer<GroupStateInterface>(
    initialState,
    // GET ALL
    on(
      groupActions.getAllGroups,
      (state): GroupStateInterface => ({
        ...state,
        isLoading: true,
      })
    ),
    on(
      groupActions.getAllGroupsSuccess,
      (state, action): GroupStateInterface => ({
        ...state,
        isLoading: false,
        allData: action.groups,
      })
    ),
    on(
      groupActions.getAllGroupsFailure,
      (state, action): GroupStateInterface => ({
        ...state,
        isLoading: false,
        error: action.error,
      })
    ),
    // GET WITH QUERY
    on(
      groupActions.getGroupsWithQuery,
      (state): GroupStateInterface => ({
        ...state,
        isLoading: true,
      })
    ),
    on(
      groupActions.getGroupsWithQuerySuccess,
      (state, action): GroupStateInterface => ({
        ...state,
        isLoading: false,
        tableData: action.groups,
        totalElements: action.totalElements,
      })
    ),
    on(
      groupActions.getGroupsWithQueryFailure,
      (state, action): GroupStateInterface => ({
        ...state,
        isLoading: false,
        error: action.error,
      })
    ),
    // CREATE GROUP
    on(
      groupActions.createGroup,
      (state): GroupStateInterface => ({
        ...state,
        isSubmitting: true,
      })
    ),
    on(
      groupActions.createGroupSuccess,
      (state): GroupStateInterface => ({
        ...state,
        isSubmitting: false,
      })
    ),
    on(
      groupActions.createGroupFailure,
      (state, action): GroupStateInterface => ({
        ...state,
        isSubmitting: false,
        error: action.error,
      })
    )
  ),
});

export const {
  name: groupFeatureKey,
  reducer: groupReducer,
  selectIsSubmitting: selectGroupIsSubmitting,
  selectIsLoading: selectGroupIsLoading,
  selectError: selectGroupError,
  selectTableData: selectGroupTableData,
  selectAllData: selectGroupAllData,
  selectTotalElements: selectTotalGroupElements,
  selectQueryParams: selectGroupQueryParams,
  selectAreLoaded: selectGroupAreLoaded,
} = groupFeature;
