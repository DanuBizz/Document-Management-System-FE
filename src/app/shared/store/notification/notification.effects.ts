import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { documentActions } from '../../../admin-view/documents/store/document.actions';
import { tap } from 'rxjs/operators';
import { categoryActions } from '../../../admin-view/categories/store/category.actions';
import { groupActions } from '../../../admin-view/users/store/group/group.actions';
import { userActions } from '../../../admin-view/users/store/user/user.actions';
import { docCategoryActions } from '../doc-category/doc-category.actions';
import { fileActions } from '../file/file.actions';

export const openNotificationErrorEffect = createEffect(
  (actions$ = inject(Actions), notificationService = inject(NotificationService)) => {
    return actions$.pipe(
      ofType(
        documentActions.getDocumentsWithQueryFailure,
        documentActions.createDocumentVersionFailure,
        documentActions.changeDocumentVisibilityFailure,

        categoryActions.getAllCategoriesFailure,
        categoryActions.getCategoriesWithQueryFailure,
        categoryActions.createCategoryFailure,
        categoryActions.updateCategoryFailure,

        userActions.getAllUsersFailure,
        userActions.getUsersWithQueryFailure,
        userActions.changeUserRoleFailure,

        groupActions.getAllGroupsFailure,
        groupActions.getGroupsWithQueryFailure,
        groupActions.createGroupFailure,
        groupActions.changeGroupUsersFailure,

        docCategoryActions.getAllDocumentCategoriesFailure,

        fileActions.getFileFailure
      ),
      tap(action => {
        const errorCode = action.error?.['status'] ?? `Unknown`;
        const errorTitle = action.error?.['title'] ?? `Unknown`;
        const errorType = action.type;
        const message = `${errorType}\n` + `Error: ` + `${errorCode}\t` + `Titel: ` + `${errorTitle}`;

        notificationService.pushNotification(message, true);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const openNotificationSuccessEffect = createEffect(
  (actions$ = inject(Actions), notificationService = inject(NotificationService)) => {
    return actions$.pipe(
      ofType(
        documentActions.getDocumentsWithQuerySuccess,
        documentActions.createDocumentVersionSuccess,
        documentActions.changeDocumentVisibilitySuccess,

        categoryActions.getAllCategoriesSuccess,
        categoryActions.getCategoriesWithQuerySuccess,
        categoryActions.createCategorySuccess,
        categoryActions.updateCategorySuccess,

        userActions.getAllUsersSuccess,
        userActions.getUsersWithQuerySuccess,
        userActions.changeUserRoleSuccess,

        groupActions.getAllGroupsSuccess,
        groupActions.getGroupsWithQuerySuccess,
        groupActions.createGroupSuccess,
        groupActions.changeGroupUsersSuccess,

        docCategoryActions.getAllDocumentCategoriesSuccess,

        fileActions.getFileSuccess
      ),
      tap(action => {
        notificationService.pushNotification(`${action.type}`, false);
      })
    );
  },
  { functional: true, dispatch: false }
);
