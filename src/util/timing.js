//Super handy timing stuff slightly adapted from https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95
//These functions are reliably consistent and have minimal overhead

export function animationTimeout(ms, signal, callback) {
    // Prefer currentTime, as it'll better sync animtions queued in the
    // same frame, but if it isn't supported, performance.now() is fine.
    const start = document.timeline ? document.timeline.currentTime : performance.now();
    let res, rej;
    const prom = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
    });

    function frame(time) {
        if (signal?.aborted) {
            rej();
            return;
        }
        callback(time);
        res();
    }

    function scheduleFrame(time) {
        const elapsed = time - start;
        const roundedElapsed = Math.round(elapsed / ms) * ms;
        const targetNext = start + roundedElapsed + ms;
        const delay = targetNext - performance.now();
        setTimeout(() => requestAnimationFrame(frame), delay);
        //setTimeout((time) => frame.call(this), delay);
    }
    scheduleFrame(start);
    return prom;
}

export function animationInterval(ms, signal, callback) {
    // Prefer currentTime, as it'll better sync animtions queued in the
    // same frame, but if it isn't supported, performance.now() is fine.
    const start = document.timeline ? document.timeline.currentTime : performance.now();

    function frame(time) {
        if (signal?.aborted) return;
        callback(time);
        scheduleFrame(time);
    }

    function scheduleFrame(time) {
        const elapsed = time - start;
        const roundedElapsed = Math.round(elapsed / ms) * ms;
        const targetNext = start + roundedElapsed + ms;
        const delay = targetNext - performance.now();
        setTimeout(() => requestAnimationFrame(frame), delay);
        //setTimeout((time) => frame.call(this), delay);
    }

    scheduleFrame(start);
}
