/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Sheep = __webpack_require__(1);

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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class Sheep {
  constructor(options = {}) {
    this.pos = options.pos || this.generateRandomPosition();
    this.width = options.width || 1;
    this.img = document.getElementById('sheepSvg');
    this.growing = true;
  }

  generateRandomPosition() {
    // multiplying by 540 to get a number between 1 and 540, add 50 so that it never goes off screen
    // max width is 100 px so 50 px radius --> won't hit edge
    let x = Math.floor((Math.random() * 540)) + 50;
    let y = Math.floor((Math.random() * 380)) + 50;
    console.log(x, y);
    return [x, y];
  }

  clickHandler(e) {
    e.preventDefault();
    // remove from sheep array in game? --> stop rendering it
  }

  draw(ctx) {
    ctx.drawImage(f.img, f.pos[0] - f.width/2, f.pos[1] - f.width/2, f.width, f.width);
    if(this.growing) {
      f.width += 1;
      if(f.width === 100) {
        this.growing = false;
      }
    } else {
      f.width -= 1;
    }
  }
}

module.exports = Sheep;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map