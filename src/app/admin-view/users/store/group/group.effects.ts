import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { GroupService } from '../../../../shared/service/group.service';
import { GroupResponseInterface } from '../../../type/group-response-interface';
import { groupActions } from './group.actions';

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
      switchMap(({ pagination }) =>
        groupService.fetchGroupsWithQuery(pagination).pipe(
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
          map(({ message }) => groupActions.createGroupSuccess({ message })),
          catchError((errorResponse: HttpErrorResponse) => of(groupActions.createGroupFailure(errorResponse.error)))
        )
      )
    );
  },
  { functional: true }
);
