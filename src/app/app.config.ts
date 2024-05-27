import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

// import of all effects
import * as categoriesEffects from './admin-view/categories/store/category.effects';
import * as documentEffects from './admin-view/documents/store/document.effects';
import * as authEffects from './auth/store/auth.effects';
import * as userEffects from './admin-view/users/store/user/user.effects';
import * as docCategoryEffects from './shared/store/doc-category/doc-category.effects';
import * as fileEffects from './shared/store/file/file.effects';
import * as groupEffects from './admin-view/users/store/group/group.effects';
import * as notificationEffects from './shared/store/notification/notification.effects';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { categoryFeatureKey, categoryReducer } from './admin-view/categories/store/category.reducers';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { documentFeatureKey, documentReducer } from './admin-view/documents/store/document.reducers';
import { authFeatureKey, authReducer } from './auth/store/auth.reducers';
import { authInterceptor } from './shared/service/auth-interceptor.service';
import { userFeatureKey, userReducer } from './admin-view/users/store/user/user.reducers';
import { docCategoryFeatureKey, docCategoryReducer } from './shared/store/doc-category/doc-category.reducers';
import { fileFeatureKey, fileReducer } from './shared/store/file/file.reducers';
import { groupFeatureKey, groupReducer } from './admin-view/users/store/group/group.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide HttpClient with interceptors
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideAnimationsAsync(),
    // Provide store configuration with router reducer
    provideStore({
      router: routerReducer,
    }),
    // Provide state configuration for different features
    provideState(authFeatureKey, authReducer),
    provideState(categoryFeatureKey, categoryReducer),
    provideState(documentFeatureKey, documentReducer),
    provideState(userFeatureKey, userReducer),
    provideState(docCategoryFeatureKey, docCategoryReducer),
    provideState(fileFeatureKey, fileReducer),
    provideState(groupFeatureKey, groupReducer),
    // Provide effects
    provideEffects([
      categoriesEffects,
      documentEffects,
      authEffects,
      userEffects,
      docCategoryEffects,
      fileEffects,
      groupEffects,
      notificationEffects,
    ]),
    // Provide router store
    provideRouterStore(),
    // Provide store devtools configuration
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
