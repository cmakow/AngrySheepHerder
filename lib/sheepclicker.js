const Sheep = require('./sheep');
const Game = require('./game');
const GameView = require('./gameview');

function waitForElement(id, callback){
    var poops = setInterval(function(){
        if(document.getElementById(id)){
            clearInterval(poops);
            callback();
        }
    }, 30);
}

document.addEventListener('DOMContentLoaded', function(){
  const canvasEl = document.getElementById('canvas');
  canvasEl.width = '640';
  canvasEl.height = '480';

  const ctx = canvasEl.getContext('2d');
  // const background = document.getElementById('background');

  const f = new GameView(canvasEl, ctx);

  waitForElement('background', () => {
    f.setup();
  })

  // background.addEventListener('load', () => {
  //   f.setup();
  // })
  // f.setup();
});
