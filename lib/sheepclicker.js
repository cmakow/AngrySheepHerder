const Sheep = require('./sheep');

document.addEventListener('DOMContentLoaded', function(){
  const canvasEl = document.getElementById('canvas');
  canvasEl.width = '640';
  canvasEl.height = '480';

  const ctx = canvasEl.getContext('2d');

  ctx.fillStyle = '#2f66bf';
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

  let f  = new Sheep({});

  let growing = true;
  let g = setInterval(() => {
    ctx.fillStyle = '#2f66bf';
    if(f.width < 10) {
      ctx.fillRect(f.pos[0] - f.width/2, f.pos[1] - f.width/2, f.width + 5, f.width + 5);
    } else {
      ctx.fillRect(f.pos[0] - f.width/2, f.pos[1] - f.width/2, f.width, f.width);
    }
    ctx.drawImage(f.img, f.pos[0] - f.width/2, f.pos[1] - f.width/2, f.width, f.width);
    if(growing) {
      f.width += 1;
      if(f.width === 100) {
        growing = false;
      }
    } else {
      f.width -= 1;
    }
    if (f.width === 0) {
      clearInterval(g);
    }
  }, 30)

});
