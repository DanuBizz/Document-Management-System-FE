import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DispatchActionService {
  constructor() {}

  /**
   * Checks the state represented by the given observable selector and dispatches an action if the state indicates that the action should be performed.
   *
   * This method subscribes to the provided observable selector, takes the first emitted value, and checks if the value indicates that an action should be performed.
   * If the condition is met (i.e., the value is false), the provided action function is invoked.
   *
   * @param areLoadedSelector An observable selector representing the state to be checked.
   * @param action A function that performs the action to be dispatched if the state condition is met.
   */
  checkAndDispatchAction(areLoadedSelector: Observable<boolean>, action: () => void) {
    areLoadedSelector.pipe(take(1)).subscribe(areLoaded => {
      if (!areLoaded) {
        action();
      }
    });
  }
}
