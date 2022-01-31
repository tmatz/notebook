import { concatMap, exhaustMap, mergeMap, switchMap } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { assert, describe, it } from "vitest";

describe("rxjs", () => {
  const scheduler = new TestScheduler(assert.deepEqual);
  it("mergeMap", () => {
    scheduler.run(({ expectObservable, hot, cold }) => {
      const a$ = hot("           --0--1--2|");
      const b$ = cold("            ----x|"); // promise
      const x$ = a$.pipe(mergeMap((_) => b$));
      //                           ----x
      //                              ----x
      //                                 ----x
      expectObservable(x$).toBe("------x--x--x|");
    });
  });
  it("switchMap", () => {
    const scheduler = new TestScheduler(assert.deepEqual);
    scheduler.run(({ expectObservable, hot, cold }) => {
      const a$ = hot("           --0--1--2|");
      const b$ = cold("            ----x|"); // promise
      const x$ = a$.pipe(switchMap((_) => b$));
      //                           ---|
      //                              ---|
      //                                 ----x
      expectObservable(x$).toBe("------------x|");
    });
  });
  it("concatMap", () => {
    const scheduler = new TestScheduler(assert.deepEqual);
    scheduler.run(({ expectObservable, hot, cold }) => {
      const a$ = hot("           --0--1--2|");
      const b$ = cold("            ----x|"); // promise
      const x$ = a$.pipe(concatMap((_) => b$));
      //                           ----x
      //                                ----x
      //                                     ----x
      expectObservable(x$).toBe("------x----x----x|");
    });
  });
  it("exhaustMap", () => {
    const scheduler = new TestScheduler(assert.deepEqual);
    scheduler.run(({ expectObservable, hot, cold }) => {
      const a$ = hot("           --0--1--2|");
      const b$ = cold("            ----x|"); // promise
      const x$ = a$.pipe(exhaustMap((_) => b$));
      //                           ----x
      //                              -|
      //                                 ----x
      expectObservable(x$).toBe("------x-----x|");
    });
  });
});
