// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const resolution = { x: 400, y: 400 };

init();

function init() {
  canvas.width = resolution.x;
  canvas.height = resolution.y;
  loop()
}

function loop() {
  let imageData = ctx.createImageData(canvas.width, canvas.height);
  for (i = 0; i < imageData.data.length; i += 4) {
    let fragCoord = { x: (i / 4) % canvas.width, y: canvas.height - (i / 4) / canvas.width };
    let color = colorRGBA(fragCoord);
    imageData.data[i] = color[0]; // red
    imageData.data[i + 1] = color[1]; // green
    imageData.data[i + 2] = color[2]; // blue
    imageData.data[i + 3] = color[3]; // alpha
  }
  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(loop);
}

function colorRGBA(fragCoord) {
  let r, g, b, a;
  let time = performance.now() / 1000;
  let uv = { x: fragCoord.x / resolution.x, y: fragCoord.y / resolution.y };

  let center = { x: resolution.x / 2, y: resolution.y / 2 };
  let radius = 0.25 * resolution.y;
  let color = [0.5 + 0.5 * Math.cos(time + uv.x), 0.5 + 0.5 * Math.cos(time + uv.y + 2), 0.5 + 0.5 * Math.cos(time + uv.x + 4)];
  let layer = circle(fragCoord, center, radius, color)

  r = color[0];
  g = color[1];
  b = color[2];
  a = layer[3];

  return [lerp(0, 255, r) || 0, lerp(0, 255, g) || 0, lerp(0, 255, b) || 0, lerp(0, 255, a) || 0];
}

function circle(fragCoord, pos, rad, color) {
  let d = length(pos.x - fragCoord.x, pos.y - fragCoord.y) - rad;
  let t = clamp(d, 0, 1);
  return [...color, 1 - t];
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
