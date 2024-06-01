import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
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
  // Get CSRF token from PersistenceService
  const csrfToken = persistenceService.get('csrfToken');
  // Clone the request and set authorization header with token if available
  let headers = new HttpHeaders();
  // Set Authorization header if token is available
  if (token) {
    headers = headers.set('Authorization', `Basic ${token}`);
  }
  // Set X-CSRF-TOKEN header if csrfToken is available
  if (csrfToken) {
    headers = headers.set('X-CSRF-TOKEN', `${csrfToken}`);
  }
  request = request.clone({ headers });
  // Proceed to next interceptor or HTTP handler with the modified request
  return next(request);
};
