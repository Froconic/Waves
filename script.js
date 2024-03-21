const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height= window.innerHeight

console.log(ctx)
ctx.fillStyle = 'white'
ctx.strokeStyle = 'white'
ctx.lineWidth = 1
linecap = 'round'


// Change the math floor to get decimals
class Particle {
  constructor(effect){
    this.effect = effect
    this.x = Math.floor(Math.random() * this.effect.width)
    this.y = Math.floor(Math.random() * this.effect.height)
    this.speedX
    this.speedY
    this.boost = Math.floor(Math.random() * 2 - 1)
    this.history = [{x: this.x, y: this.y}]
    this.maxLength = (Math.random() * 300) + 33
    this.timer = this.maxLength * 1.1
    this.angle
  }
  draw(context){
    // context.fillRect(this.x, this.y, 5,5)
    context.beginPath()
    context.moveTo(this.history[0].x, this.history[0].y)
    for (let i = 0; i < this.history.length; i++){
      context.lineTo(this.history[i].x,this.history[i].y)
    }
    context.stroke()
  }
  // Multiply the speed to get circles
  // Add the speed to get lines
  update(){
    this.timer --
    if (this.timer >= 1){
      let x = Math.floor(this.x / this.effect.cellSize)
    let y = Math.floor(this.y/ this.effect.cellSize)
    let index = y * this.effect.cols + x
    this.angle = this.effect.field[index]

    this.speedX = Math.sin(this.angle)
    this.speedY = Math.cos(this.angle)
    this.x += this.speedX + this.boost
    this.y += this.speedY + this.boost

    this.history.push({x: this.x, y: this.y})
    if (this.history.length > this.maxLength){
      this.history.shift()
    }
  } else if (this.history.length > 1) {
      this.history.shift()
    } else {
      this.reset()
    }
    }
  reset(){
    this.x = Math.floor(Math.random() * this.effect.width)
    this.y = Math.floor(Math.random() * this.effect.height)
    this.history = [{x: this.x, y: this.y}]
    this.timer = this.maxLength * 2
  }
}


class Effect {
  constructor(width, height){
    this.width = width
    this.height = height
    this.particles = []
    this.numberOfParticles = 500
    this.cellSize = 20
    this.rows
    this.cols
    this.field = []
    this.curve = .668
    this.zoom = .5
    this.init();
  }
  init(){
    this.rows = Math.floor(this.height / this.cellSize)
    this.cols = Math.floor(this.width / this.cellSize)
    this.field = []
    for (let y = 0; y < this.rows; y++){
      for (let x = 0; x < this.cols; x++){
        let angle = (Math.sin(x*  this.zoom) + Math.cos(y * this.zoom)) * this.curve
        this.field.push(angle)
      }
    }

    for (let i = 0; i <= this.numberOfParticles; i++){
      this.particles.push(new Particle(this))
    }
  }
  render(context){
    this.particles.forEach(particle => {
      particle.draw(context)
      particle.update()
    })
  }
}

const effect = new Effect(canvas.width, canvas.height)
animate()
console.log(effect)

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  effect.render(ctx)
  requestAnimationFrame(animate)
}