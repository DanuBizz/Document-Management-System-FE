import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, mergeMap, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { GroupService } from '../../../../shared/service/group.service';
import { GroupResponseInterface } from '../../../type/group-response-interface';
import { groupActions } from './group.actions';
import { selectGroupQueryParams } from './group.reducers';
import { Store } from '@ngrx/store';

export const getAllGroupsEffect = createEffect(
  (actions$ = inject(Actions), groupService = inject(GroupService)) => {
    return actions$.pipe(
      ofType(groupActions.getAllGroups),
      switchMap(() => {
        return groupService.fetchAllGroups().pipe(
          map((groups: GroupResponseInterface[]) => {
            return groupActions.getAllGroupsSuccess({ groups });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(groupActions.getAllGroupsFailure(errorResponse.error));
          })
        );
      })
    );
  },
  { functional: true }
);

export const getGroupsWithQueryEffect = createEffect(
  (actions$ = inject(Actions), groupService = inject(GroupService)) => {
    return actions$.pipe(
      ofType(groupActions.getGroupsWithQuery),
      switchMap(({ queryParams }) =>
        groupService.fetchGroupsWithQuery(queryParams).pipe(
          map(response =>
            groupActions.getGroupsWithQuerySuccess({
              groups: response.groups,
              totalElements: response.totalElements,
            })
          ),
          catchError((errorResponse: HttpErrorResponse) =>
            of(groupActions.getGroupsWithQueryFailure(errorResponse.error))
          )
        )
      )
    );
  },
  { functional: true }
);

export const createGroupEffect = createEffect(
  (actions$ = inject(Actions), groupService = inject(GroupService)) => {
    return actions$.pipe(
      ofType(groupActions.createGroup),
      switchMap(({ group }) =>
        groupService.createGroup(group).pipe(
          map(() => groupActions.createGroupSuccess()),
          catchError((errorResponse: HttpErrorResponse) => of(groupActions.createGroupFailure(errorResponse.error)))
        )
      )
    );
  },
  { functional: true }
);

/**
 * Effect for dispatching a new action to refresh the table data
 * Upon receiving such an action, it dispatches the 'get' action to fetch updated data.
 */
export const refreshGroupTableAndAllGroupData = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(groupActions.createGroupSuccess),
      mergeMap(() => {
        return store
          .select(selectGroupQueryParams)
          .pipe(map(queryParams => groupActions.getGroupsWithQuery({ queryParams: queryParams })));
      })
    );
  },
  { functional: true, dispatch: true }
);

export const refreshAllGroupsData = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(groupActions.createGroupSuccess),
      mergeMap(() => {
        return of(groupActions.getAllGroups());
      })
    );
  },
  { functional: true, dispatch: true }
);
