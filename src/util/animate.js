/**
 * This is currently (as of Aug 2021) the safest way to do animations accross all browsers.
 * see https://www.youtube.com/watch?v=NJwxOeYYcqA for details of why css animations are not reliable
 *
 * Adapted from: https://gist.github.com/jakearchibald/0b50c4918eaf9a67bfcfa55e7e61cd56#file-1-js
 *
 * ----------------------------- Further Reading -----------------------------
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API
 * from/to: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
 * options: https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming
 * /

/**
 * -------------------------------
 * Base Animation Functions
 * -------------------------------
 * Return the full Animation object. Useful if you need greater control
 * of the Animation, but not for regular use.
 */
/**
 * Animate To
 *
 * Performs the animation starting from the elements' current
 * style state and holds the styles at the end of the animation.
 * @param {HTMLElement} element
 * @param {Keyframe[] | PropertyIndexedKeyframes} to
 * @param {KeyframeAnimationOptions} options
 *
 * @returns {Animation}
 */
export function animateTo(element, to, options) {
  if (!(element instanceof HTMLElement)) {
    console.error("Animation failed. Must pass an HTMLElement.");
    return new Animation();
  }
  const anim = element.animate(
    to,
    { ...options, fill: "both" } //this is a hack, fill must be both for it to work
  );
  anim.addEventListener("finish", () => {
    //also a hack, but animations can flicker otherwise
    anim.commitStyles(); //unfortunately may require removing element styles later
    anim.cancel(); //destroys this event listener as well so there's no memory leak
  });
  return anim;
}

/**
 * Animate From
 *
 * Sets the starting style state based on the beginning of the animation
 * and returns to default style state at the end of the animation.
 *
 * @param {HTMLElement} element
 * @param {PropertyIndexedKeyframes} from
 * @param {KeyframeAnimationOptions} options
 *
 * @returns {Animation}
 */
export function animateFrom(element, from, options) {
  if (!(element instanceof HTMLElement)) {
    console.error("Animation failed. Must pass an HTMLElement.");
    return new Animation();
  }
  return element.animate(
    { ...from, offset: 0 }, //hack, wont be consitent without offset 0
    { ...options, fill: "backwards" } //
  );
}

/** ------------------------------------
 * Promisified Base Functions
 * -------------------------------------
 * Promises are returned to more easily chain on the end of the Animation
 */
/**
 * @param {HTMLElement} element
 * @param {PropertyIndexedKeyframes} to
 * @param {KeyframeAnimationOptions} options
 *
 * @returns {Promise} Animation.finished
 */
export function animateToPromise(element, to, options) {
  return animateTo(element, to, options).finished;
}

/**
 * @param {HTMLElement} element
 * @param {PropertyIndexedKeyframes} from
 * @param {KeyframeAnimationOptions} options
 *
 * @returns {Promise} Animation.finished
 */
export function animateFromPromise(element, from, options) {
  return animateTo(element, from, options).finished;
}

/** ------------------------------------
 * Finite Prebuilt Animations
 * -------------------------------------
 * all follow the input format of:
 * ELement
 * Measure
 * Origin (if it makes sense)
 * Duration
 * Delay
 * Easing
 *
 * Promises are returned when the animation finishes.
 */
/**
 * Translate By
 * @param {HTMLElement} element
 * @param {ArrayLike} delta [dx, dy]
 * @param {Number} duration in ms
 * @param {Number} delay in ms
 * @param {String} easing "ease", "ease-in", "ease-out", "ease-in-out", "linear"
 *
 * @returns {Promise} Animation.finished
 */
export function translateXY(
  element,
  [dx, dy],
  duration = 1000,
  delay = 0,
  easing = "ease-in-out"
) {
  let to = [{ transform: `translate(${dx}px, ${dy})` }];
  let timing = {
    duration: duration,
    delay: delay,
    easing: easing
  };
  return animateToPromise(element, to, timing);
}
/**
 * Scale Up or Down
 * @param {HTMLElement} element
 * @param {ArrayLike} scale [dx, dy]
 * @param {String} origin see options at: https://developer.mozilla.org/en-US/docs/Web/CSS/offset-position
 * @param {Number} duration in ms
 * @param {Number} delay in ms
 * @param {String} easing "ease", "ease-in", "ease-out", "ease-in-out", "linear"
 *
 * @returns {Promise} completes on the end of the animation
 */
export function scaleXY(
  element,
  [scaleX, scaleY],
  origin = "center",
  duration = 1500,
  delay = 0,
  easing = "ease-in-out"
) {
  let frames = [
    {
      transform: `scale(
                ${scaleX || 0},
                ${scaleY || 0})`,
      transformOrigin: origin
    }
  ];
  let timing = {
    delay: delay,
    duration: duration,
    easing: easing
  };
  return animateToPromise(element, frames, timing);
}

/**
 * Animation Cycle
 *
 * No Promises is returned since they may cycle inifitely.
 * Promises can still be retrieved from the returned Animation object.
 * End the Animation gracefully with animation.finish().
 * End the Animation abrdupty (possible jump to final style state)
 * with animation.cancel().
 *
 * @param {HTMLElement} element
 * @param {Keyframe[] | PropertyIndexedKeyframes} frames
 * @param {KeyframeAnimationOptions} timing
 *
 * @returns {Animation}
 */
export function animateCycle(element, frames, timing) {
  if (!(element instanceof HTMLElement)) {
    console.error("Animation failed. Must pass an HTMLElement.");
    return new Animation(); //animation probably isn't critical enough to break everything.
  }
  if (!timing.iterations || timing.iterations === Infinity) {
    timing.iterations = Number.MAX_SAFE_INTEGER; //truly infinite itertions can't be finished properly
  }
  return element.animate([...frames], {
    ...timing,
    fill: "none"
  });
}

/** ------------------------------------
 * Prebuilt "Visual Cue" Animations
 * -------------------------------------
 * Draw the users attention!
 *
 * Animations produce effects that when finished do
 * not alter the element's style.
 *
 */
/**
 * Scale Pulse
 *
 * @param {HTMLElement} element
 * @param {ArrayLike} scale1 [x,y]
 * @param {Number} duration
 * @param {Number | Infinity} iterations
 * @returns {Animation}
 */
export function pulseScale(
  element,
  scale = [1.3, 1.3],
  duration = 1000,
  iterations = 3
) {
  let frames = [
    {
      transform: `scale(${scale[0]},${scale[1]})`
    }
  ];
  let timing = {
    direction: "alternate",
    easing: ["ease-in-out"],
    duration: duration
  };
  if (iterations) timing.iterations = iterations * 2;
  return animateCycle(element, frames, timing);
}

/**
 * Glow Pulse
 *
 * @param {HTMLElement} element
 * @param {ArrayLike} radius [x,y,z]
 * @param {Number} duration
 * @param {Number | Infinity} iterations
 * @returns {Animation}
 */
export function pulseGlow(
  element,
  radius = 10,
  duration = 1500,
  iterations = 3
) {
  let frames = [
    {
      filter: `drop-shadow(0 0 ${radius}px #fff)`,
      offset: 0.5
    }
  ];
  let timing = {
    direction: "alternate",
    easing: ["ease-in-out"],
    duration: duration
  };
  if (iterations) timing.iterations = iterations;
  return animateCycle(element, frames, timing);
}

/**
 * Jump and Bounce
 *
 * @param {HTMLElement} element
 * @param {Number} dy jump height in pixels
 * @param {Number} duration in ms
 * @param {Number | Infinity} iterations
 * @returns {Animation}
 */
export function jumpBounce(element, dy = 30, duration = 1200, iterations = 1) {
  let frames = [
    {
      offset: 0.0,
      transform: `scale(1,1) translateY(0px)`,
      transformOrigin: "bottom"
    },
    {
      offset: 0.1,
      transform: `scale(1.1, 0.9) translateY(0px)`,
      transformOrigin: "bottom"
    },
    {
      offset: 0.3,
      transform: `scale(.9, 1.1) translateY(-${dy}px)`,
      transformOrigin: "bottom"
    },
    {
      offset: 0.5,
      transform: `scale(1.05, .95) translateY(0px)`,
      transformOrigin: "bottom"
    },
    {
      offset: 0.57,
      transform: `scale(1, 1) translateY(-${dy / 5}px)`,
      transformOrigin: "bottom"
    },
    {
      offset: 0.64,
      transform: `scale(1, 1) translateY(0px)`,
      transformOrigin: "bottom"
    },
    {
      offset: 1.0,
      transform: `scale(1, 1) translateY(0px)`,
      transformOrigin: "bottom"
    }
  ];
  let timing = {
    duration: duration,
    easing: ["ease-in-out"]
  };
  if (iterations) timing.iterations = iterations;
  return animateCycle(element, frames, timing);
}

export function shake(
  element,
  direction,
  delta = 10,
  duration = 1000,
  iterations = 3
) {
  let method = direction === "R" ? "rotate" : `translate${direction}`;
  let unit = direction === "R" ? "deg" : "px";
  let frames = [
    //{ offset: 0.0, transform: `${method}(0${unit})` },
    { offset: 0.14, transform: `${method}(${delta / 2}${unit})` },
    { offset: 0.29, transform: `${method}(-${delta / 1.5}${unit})` },
    { offset: 0.43, transform: `${method}(${delta}${unit})` },
    { offset: 0.57, transform: `${method}(-${delta / 2}${unit})` },
    { offset: 0.71, transform: `${method}(${delta / 1.2}${unit})` },
    { offset: 0.86, transform: `${method}(-${delta}${unit})` }
    //{ offset: 1.0, transform: `${method}(0${unit})` },
  ];
  let timing = {
    duration: duration,
    easing: ["ease-in-out"]
  };
  if (iterations) timing.iterations = iterations;
  return animateCycle(element, frames, timing);
}

export function shakeRotate(
  element,
  angle = 10,
  duration = 1500,
  iterations = 1
) {
  return shake(element, "R", angle, (duration = 1500), (iterations = 1));
}

export function shakeX(element, dx = 10, duration = 1500, iterations = 1) {
  return shake(element, "X", dx, duration, iterations);
}

export function shakeY(element, dy = 10, duration = 1500, iterations = 1) {
  return shake(element, "Y", dy, duration, iterations);
}
