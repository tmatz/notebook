import { useEffect, useMemo } from "react";
import { Observable, Subject, Subscription, tap } from "rxjs";
export {
  concatMap,
  debounceTime,
  map,
  mergeMap,
  switchMap,
  tap,
  throttleTime,
} from "rxjs";

export function inspect<T>(tag: string = "") {
  return tap<T>({
    next(v) {
      console.log(`inspect next ${tag}`, v);
    },
    error(e) {
      console.log(`inspect error ${tag}`, e);
    },
    complete() {
      console.log(`inspect complete ${tag}`);
    },
  });
}

export function useObservable<T extends readonly any[]>(
  subscribe: (deps$: Observable<T>) => Subscription,
  values: T
) {
  const values$ = useMemo(() => new Subject<T>(), []);

  useEffect(() => {
    const subscription = subscribe(values$);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    values$.next(values);
  }, values);
}
