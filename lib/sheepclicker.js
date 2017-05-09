const Sheep = require('./sheep');
const Game = require('./game');
const GameView = require('./gameview');

function waitForElement(id, callback){
    var x = setInterval(function(){
        if(document.getElementById(id)){
            clearInterval(x);
            callback();
        }
    }, 30);
}

document.addEventListener('DOMContentLoaded', function(){
  const canvasEl = document.getElementById('canvas');
  const ctx = canvasEl.getContext('2d');
  canvasEl.width = '640';
  canvasEl.height = '480';
  $('#canvas').css('cursor', 'pointer');
  const f = new GameView(canvasEl, ctx);

  waitForElement('background', () => {
    f.setup();
  })

  // const background = document.getElementById('background');
  // background.addEventListener('load', () => { //breaks half the time
  //   f.setup();
  // })
  // f.setup(); //breaks the other half of the time
});
