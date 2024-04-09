const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 900;

// global settings
ctx.lineCap = 'round';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle = 'red';
ctx.strokeStyle = 'blue';
ctx.font = '500px Impact';

class Particle {
  constructor(effect){
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.speedX = 0;
    this.speedY = 0;
    this.speedModifier = Math.floor(Math.random() * 2) + 1;
    this.colors = ['#1a0014', '#590047', '#a30282', '#d100a7', '#fc03ca', '#ff38d7', '#ff70e2', '#fc9ae8', '#fccaf2', 'white'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.history = [{ x: this.x, y: this.y }];
    this.lineWidth = 0.5;
    this.maxLength = Math.floor(Math.random() * 60 + 20);
    this.timer = this.maxLength * 2;
    this.opacity = 1;
    this.oldAngle;
    this.angle;
    this.angleCorrector = Math.random() * 0.6 + 0.01;
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.oldRed = 0;
    this.oldGreen = 0;
    this.oldBlue = 0;
  }
  update() {
    this.timer-= 1;
    // reset if outside canvas area
    if (
      this.x >= this.effect.width ||
      this.x <= 0 ||
      this.y >= this.effect.height ||
      this.y <= 0
    ) {
      this.opacity -= 0.05;
    }

    // reset if timer 0
    else if (this.timer <= 0){
      this.opacity -= 0.05;
    }
    if (this.opacity <= 0.1) {
      this.reset();
    }
    // map particle position to a flow field grid cell to get angle value that will be used for speed and movement direction
    let x = Math.floor(this.x / this.effect.cellSize);
    let y = Math.floor(this.y / this.effect.cellSize);
    let index = y * Math.floor(canvas.width/this.effect.cellSize) + x;
    if (this.effect.flowField[index]){
      this.oldAngle = this.angle;
      this.newAngle = this.effect.flowField[index].colorAngle;
      if (this.oldAngle > this.newAngle) this.angle -= this.angleCorrector;
      else if (this.oldAngle < this.newAngle) this.angle += this.angleCorrector;
      else this.angle = this.effect.flowField[index].colorAngle;

      if (this.effect.flowField[index].alpha > 0) {
        this.red += (this.effect.flowField[index].red - this.red) * 0.02;
        this.green += (this.effect.flowField[index].green - this.green) * 0.02;
        this.blue += (this.effect.flowField[index].blue - this.blue) * 0.02;
        this.color = 'rgb('+ this.red + ',' + this.green + ',' + this.blue + ')';
      }
    }
    // update particle position
    this.speedX = this.speedModifier * Math.cos(this.angle);
    this.speedY = this.speedModifier * Math.sin(this.angle);
    // move particle in a direction
    this.x += this.speedX;
    this.y += this.speedY;

    // add current particle position into history array
    this.history.push({ x: this.x, y: this.y });
    // if longer than max length, remove the oldest segment
    if (this.history.length > this.maxLength) this.history.shift();
  }
  reset(){
      this.history = [];
      this.timer = this.maxLength * 2;
      this.opacity = 1;
      let attempts = 0;
      let resetSuccess = false;
      while (attempts < 100 && !resetSuccess){
          attempts++
          let testIndex = Math.floor(Math.random() * this.effect.flowField.length);
          if (this.effect.flowField[testIndex].colorAngle > 0){
              this.x = this.effect.flowField[testIndex].x;
              this.y = this.effect.flowField[testIndex].y;
              resetSuccess = true;
          }
      }
      if (!resetSuccess){
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
      }
  }
  draw(context) {
    context.save();
    context.globalAlpha = this.opacity;
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    }
    context.stroke();
    context.restore();
  }
}

class Effect {
  constructor(canvas){
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = 9000;
    this.cellSize = 2; //flow field cell size has to be an integer divisible by canvas width and canvas height with no remainder when doing flow field on text and images
    this.rows;
    this.cols;
    this.flowField = [];
    this.zoom = 0.009;
    this.curve = 2;
    this.debug = false;
    this.image = document.getElementById('image1');
    window.addEventListener('keydown', e => {
      if (e.key === 'd') this.debug = !this.debug;
    });
  }
  init(context){
    this.rows = Math.floor(this.height / this.cellSize);
    this.cols = Math.floor(this.width / this.cellSize);
    // draw text
    const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient1.addColorStop(0, 'rgb(255, 255, 0)');
    gradient1.addColorStop(0.25, 'rgb(200, 200, 50)');
    gradient1.addColorStop(0.5, 'rgb(150, 100, 100)');
    gradient1.addColorStop(0.75, 'rgb(255, 0, 150)');
    /*const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient1.addColorStop(0, 'rgb(0, 255, 0)');
    gradient1.addColorStop(0.25, 'rgb(50, 0, 50)');
    gradient1.addColorStop(0.5, 'rgb(50, 10, 100)');
    gradient1.addColorStop(0.75, 'rgb(20, 0, 0)');*/
    context.fillStyle = gradient1;
    //context.fillText('JS', this.width * 0.5, this.height * 0.5);
    context.drawImage(this.image, this.width * 0.5 - this.image.width * 0.5, this.height * 0.5 - this.image.height * 0.5);
    // scan canvas with the text drawn on it
    const pixels = context.getImageData(0, 0, this.width, this.height).data;
    // create flow field (grid of angles) based on pixel data
    for (let y = 0; y < this.height; y+= this.cellSize){
      for (let x = 0; x < this.width; x+= this.cellSize){
        const index = (y * this.width + x) * 4;
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const alpha = pixels[index + 3];
        const color = 'rgb('+ red + ',' + green + ',' + blue + ')';
        const grayscale = (red + green + blue) / 3; 
        const grayscaleColor = 'rgb('+ grayscale + ',' + grayscale + ',' + grayscale + ')';
        // convert grayscale range of 0 to 255 to angle range of 0 to 6.28
        //new_value = ( (old_value - old_min) / (old_max - old_min) ) * (new_max - new_min) + new_min
        //const colorAngle = ((grayscale - 0) / (255 / 0)) * (6.28 - 0) + 0;
        const colorAngle = ((grayscale / 255 ) * 6.28).toFixed(5) * 1.5;
        this.flowField.push({
          x: x,
          y: y,
          color: color,
          grayscale: grayscale,
          colorAngle: colorAngle,
          red: red,
          green: green,
          blue: blue,
          alpha: alpha
        });
      }
    }
    // create particles
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
    console.log(this.particles, this);
  }
  render(context){
    context.fillStyle = 'rgba(0, 0, 0, 1)';
    context.fillRect(0, 0, this.width, this.height);
    this.particles.forEach(particle => {
      particle.update();
      particle.draw(context);
    });
    // draw flow field grid for debugging
    if (this.debug){
      context.strokeStyle = 'white';
      context.lineWidth = 0.3;
      for (let a = 0; a < this.cols; a++){
        context.beginPath();
        context.moveTo(this.cellSize * a, 0);
        context.lineTo(this.cellSize * a, this.height);
        context.stroke();
      }
      for (let b = 0; b < this.rows; b++){
        context.beginPath();
        context.moveTo(0, this.cellSize * b);
        context.lineTo(this.width, this.cellSize * b);
        context.stroke();
      }
    }
  }
}

const effect = new Effect(canvas);
effect.init(ctx);
effect.render(ctx)
console.log(effect.flowField)

function animate(){
  effect.render(ctx);
  requestAnimationFrame(animate);
}
animate();