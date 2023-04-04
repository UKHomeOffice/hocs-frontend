export function buildCompletablePromise<T>(): Promise<T> & { reject: (err: unknown) => void, resolve: (t: T) => void } {
    let resolveFn, rejectFn;
    const promise = new Promise((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
    });
    promise.resolve = resolveFn;
    promise.reject = rejectFn;

    return promise;
}
