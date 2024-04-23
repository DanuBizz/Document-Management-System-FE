import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideHttpClient } from '@angular/common/http';
import { categoryFeatureKey, categoryReducer } from './admin-view/categories/store/category.reducers';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// import of all effects
import * as categoriesEffects from './admin-view/categories/store/category.effects';
import * as documentEffects from './admin-view/documents/store/document.effects';
import { documentFeatureKey, documentReducer } from './admin-view/documents/store/document.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore({
      router: routerReducer,
    }),
    provideState(categoryFeatureKey, categoryReducer),
    provideEffects([categoriesEffects, documentEffects]),
    provideState(documentFeatureKey, documentReducer),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
