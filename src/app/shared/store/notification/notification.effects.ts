import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { documentActions } from '../document/document.actions';
import { tap } from 'rxjs/operators';
import { categoryActions } from '../../../admin-view/store/category/category.actions';
import { groupActions } from '../../../admin-view/store/group/group.actions';
import { userActions } from '../../../admin-view/store/user/user.actions';
import { docCategoryActions } from '../doc-category/doc-category.actions';
import { fileActions } from '../file/file.actions';
import { authActions } from '../../../auth/store/auth.actions';

export const openNotificationErrorEffect = createEffect(
  (actions$ = inject(Actions), notificationService = inject(NotificationService)) => {
    return actions$.pipe(
      ofType(
        documentActions.getDocumentsWithQueryFailure,
        documentActions.getUserDocumentsWithQueryFailure,
        documentActions.getUnreadUserDocumentsFailure,
        documentActions.createDocumentVersionFailure,
        documentActions.changeDocumentVisibilityFailure,
        documentActions.confirmDocumentFailure,

        categoryActions.getAllCategoriesFailure,
        categoryActions.getCategoriesWithQueryFailure,
        categoryActions.createCategoryFailure,
        categoryActions.updateCategoryFailure,

        userActions.getAllUsersFailure,
        userActions.getUsersWithQueryFailure,
        userActions.changeUserRoleFailure,
        userActions.changeUserGroupsFailure,

        groupActions.getAllGroupsFailure,
        groupActions.getGroupsWithQueryFailure,
        groupActions.createGroupFailure,

        docCategoryActions.getAllDocumentCategoriesFailure,

        fileActions.getFileFailure,

        authActions.loginFailure
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
        documentActions.getUserDocumentsWithQuerySuccess,
        documentActions.getUnreadUserDocumentsSuccess,
        documentActions.createDocumentVersionSuccess,
        documentActions.changeDocumentVisibilitySuccess,
        documentActions.confirmDocumentSuccess,

        categoryActions.getAllCategoriesSuccess,
        categoryActions.getCategoriesWithQuerySuccess,
        categoryActions.createCategorySuccess,
        categoryActions.updateCategorySuccess,

        userActions.getAllUsersSuccess,
        userActions.getUsersWithQuerySuccess,
        userActions.changeUserRoleSuccess,
        userActions.changeUserGroupsSuccess,

        groupActions.getAllGroupsSuccess,
        groupActions.getGroupsWithQuerySuccess,
        groupActions.createGroupSuccess,

        docCategoryActions.getAllDocumentCategoriesSuccess,

        fileActions.getFileSuccess,

        authActions.loginSuccess,
        authActions.logoutSuccess
      ),
      tap(action => {
        notificationService.pushNotification(`${action.type}`, false);
      })
    );
  },
  { functional: true, dispatch: false }
);
