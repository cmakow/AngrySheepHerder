class Canvas {
  constructor() {
    this.height = 480;
    this.width = 640;
    this.gameHeight = 420;
    this.gameWidth = 600;

    this.createCanvas();
  }

  createCanvas() {
    let canvas = document.createElement('canvas');
    canvas.id = 'SheepClickerCanvas';
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.position = 'absolute';
    document.body.appendChild(canvas);
  }
}

// unnecessary for now, maybe necessary if allowing player to change canvas size
