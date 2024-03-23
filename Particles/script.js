const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height= window.innerHeight
// TODO Fix and make boiler plate
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
    this.boost = Math.floor((Math.random() * 3) + 1)
    this.angle
  }
  draw(context){
    context.fillRect(this.x, this.y, 5,5)
  }
  // Multiply the speed to get circles
  // Add the speed to get lines
  update(){
    this.angle = this.effect.field[index]

    this.speedX = Math.cos(this.angle)
    this.speedY = Math.sin(this.angle)
    this.x += this.speedX + this.boost
    this.y += this.speedY + this.boost

    }
}


class Effect {
  constructor(width, height){
    this.width = width
    this.height = height
    this.particles = []
    this.numberOfParticles = 100
    this.cellSize = 20
    this.rows
    this.cols
    this.field = []
    this.curve = .001
    this.zoom = .1
    this.debug = true
    this.init();

    window.addEventListener('keydown', e => {
      if (e.key === 'd') this.debug = !this.debug
    })
  }

  init(){
    this.rows = Math.floor(this.height / this.cellSize)
    this.cols = Math.floor(this.width / this.cellSize)
    this.field = []
    for (let y = 0; y < this.rows; y++){
      for (let x = 0; x < this.cols; x++){
        let angle = Math.cos(x *  this.zoom) + Math.sin(y * this.zoom) * this.curve
        this.field.push(angle)
      }
    }

    for (let i = 0; i <= this.numberOfParticles; i++){
      this.particles.push(new Particle(this))
    }
  }

  drawGrid(context){
    context.save()
    context.strokeStyle = "#6667AB"
    context.lineWidth = .25
    for (let c = 0; c < this.cols; c++){
      context.beginPath()
      context.moveTo(this.cellSize * c, 0)
      context.lineTo(this.cellSize * c, this.height)
      context.stroke()
    }
    for (let r = 0; r < this.rows; r++){
      context.beginPath()
      context.moveTo(0,this.cellSize * r)
      context.lineTo(this.width, this.cellSize * r)
      context.stroke()
    }
    context.restore()
  }

  render(context){
    if (this.debug) this.drawGrid(context)
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
  effect.render(ctx)
}