import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

// import of all effects
import * as categoriesEffects from './admin-view/categories/store/category.effects';
import * as documentEffects from './admin-view/documents/store/document.effects';
import * as authEffects from './auth/store/auth.effects';
import * as userEffects from './admin-view/users/store/user.effects';

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
import {userFeatureKey, userReducer} from "./admin-view/users/store/user.reducers";

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
    // Provide effects
    provideEffects([categoriesEffects, documentEffects, authEffects, userEffects]),
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
