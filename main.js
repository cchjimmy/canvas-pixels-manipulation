// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

!function init() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const resolution = { x: 400, y: 400 };

  canvas.width = resolution.x;
  canvas.height = resolution.y;
  let imageData = ctx.createImageData(resolution.x, resolution.y);
  let fragCoord = {
    x: 0,
    y: 0,
  };
  let uv = {
    x: 0,
    y: 0,
  };
  const throttledLog = throttle(
    (...messages) => console.log(...messages),
    1000,
  );
  let past = performance.now() / 1000;
  setInterval(loop, 1000 / 30);
  function loop() {
    let time = performance.now() / 1000;
    let dt = time - past;
    throttledLog(1 / dt);
    for (let i = 0; i < imageData.data.length; i += 4) {
      fragCoord.x = (i / 4) % resolution.x;
      fragCoord.y = resolution.y - (i / 4) / resolution.x;
      uv.x = fragCoord.x / resolution.x;
      uv.y = fragCoord.y / resolution.y;
      colorRGBA(
        fragCoord,
        uv,
        resolution,
        time,
        imageData.data,
        i,
        i + 1,
        i + 2,
        i + 3,
      );
    }
    ctx.putImageData(imageData, 0, 0);
    past = time;
    // requestAnimationFrame(loop);
  }
}();

function colorRGBA(fragCoord, uv, resolution, time, data, ri, gi, bi, ai) {
  !circle(
      fragCoord,
      resolution.x * 0.5,
      resolution.y * 0.5,
      resolution.y * 0.5,
    )
    ? rainbow(uv, time, data, ri, gi, bi, ai)
    : (() => {
      data[ri] = 0;
      data[gi] = 0;
      data[bi] = 0;
      data[ai] = 255;
    })();
}

function circle(fragCoord, x, y, rad) {
  let d = length(x - fragCoord.x, y - fragCoord.y) - rad;
  let t = clamp(d, 0, 1);
  return t;
}

function rainbow(uv, time, data, ri, gi, bi, ai) {
  data[ri] = lerp(0, 255, 0.5 + 0.5 * Math.cos(time + uv.x));
  data[gi] = lerp(0, 255, 0.5 + 0.5 * Math.cos(time + uv.y + 2));
  data[bi] = lerp(0, 255, 0.5 + 0.5 * Math.cos(time + uv.x + 4));
  data[ai] = 255;
}
function length(x, y) {
  return (x * x + y * y) ** 0.5;
}

function clamp(min, preferred, max) {
  return Math.min(Math.max(min, preferred), max);
}

function lerp(min, max, percent) {
  return min + (max - min) * percent;
}

function throttle(fn, delay) {
  let shouldWait = false;
  return (...args) => {
    if (shouldWait) return;
    fn(...args);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
}
