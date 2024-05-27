import { HttpInterceptorFn } from '@angular/common/http';
import { PersistenceService } from '../../auth/service/persistence.service';
import { inject } from '@angular/core';

/**
 * HTTP interceptor for adding authorization token to outgoing requests.
 * Retrieves the access token from the PersistenceService and attaches it to the request headers.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  // Inject PersistenceService to retrieve access token
  const persistenceService = inject(PersistenceService);
  // Get access token from PersistenceService
  const token = persistenceService.get('accessToken');
  // Clone the request and set authorization header with token if available
  request = request.clone({
    setHeaders: {
      Authorization: token ? `Basic ${token}` : '',
    },
  });
  // Proceed to next interceptor or HTTP handler with the modified request
  return next(request);
};
