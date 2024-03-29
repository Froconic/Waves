// TODO Delete and get back to standard implemenation

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = 1000
canvas.height= 1000

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
    this.history = [{x: this.x, y: this.y}]
    this.maxLength = Math.floor((Math.random() * 10) + 111)
    this.timer = this.maxLength * 1.5
    this.angle = 0
    this.colors = ['#D6EFFF','#85D0FF', '#33B1FF', '#008AE0', '#00588F']
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
  }
  draw(context){
    // context.fillRect(this.x, this.y, 5,5)
    context.beginPath()
    context.moveTo(this.history[0].x, this.history[0].y)
    for (let i = 0; i < this.history.length; i++){
      context.lineTo(this.history[i].x,this.history[i].y)
    }
    context.strokeStyle = this.color
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
      if (this.effect.field[index])
      {
        this.angle = this.effect.field[index].colorAngle
      }

      this.speedX = Math.cos(this.angle)
      this.speedY = Math.sin(this.angle)
      this.x += this.speedX * this.boost
      this.y += this.speedY * this.boost
      // All add
      // this.x += (this.speedX + Math.cos(this.angle)) + this.boost
      // this.y += (this.speedY + Math.sin(this.angle)) + this.boost
      // All multiply
      // this.x += (this.speedX * Math.cos(this.angle)) * this.boost
      // this.y += (this.speedY * Math.sin(this.angle)) * this.boost
      // Add to speed multiply boost
      // this.x += (this.speedX + Math.cos(this.angle)) * this.boost
      // this.y += (this.speedY + Math.sin(this.angle)) * this.boost
      // Multiply speed and add boost
      // this.x += (this.speedX * Math.cos(this.angle)) + this.boost
      // this.y += (this.speedY * Math.sin(this.angle)) + this.boost
      // Add speed and subtract boost
      // this.x += (this.speedX + Math.cos(this.angle)) - this.boost
      // this.y += (this.speedY + Math.sin(this.angle)) - this.boost
      // Add speed and divide boost
      // this.x += (this.speedX + Math.cos(this.angle)) / this.boost
      // this.y += (this.speedY + Math.sin(this.angle)) / this.boost
      // Multiply speed and subtract boost
      // this.x += (this.speedX * Math.cos(this.angle)) - this.boost
      // this.y += (this.speedY * Math.sin(this.angle)) - this.boost
      // Divide speed and add boost
      // this.x += (this.speedX / Math.cos(this.angle)) + this.boost
      // this.y += (this.speedY / Math.sin(this.angle)) + this.boost
      // Divide speed and add boost
      // this.x += (this.speedX / Math.cos(this.angle)) / this.boost
      // this.y += (this.speedY / Math.sin(this.angle)) / this.boost

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
    this.timer = this.maxLength * 1.5
  }
}


class Effect {
  constructor(canvas, ctx){
    this.canvas = canvas
    this.context = ctx
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.particles = []
    this.numberOfParticles = 500
    this.cellSize = 5
    this.rows
    this.cols
    this.field = []
    this.curve = 1
    this.zoom = .07
    this.debug = true
    this.init();

    window.addEventListener('keydown', e => {
      if (e.key === 'd') this.debug = !this.debug
    })

    window.addEventListener('resize', e => {
      // this.resize(e.target.innerWidth, e.target.innerHeight)
    })
  }

  drawText(){
    this.context.font = '400px Impact'
    this.context.textAlign = 'center'
    this.context.textBaseline = 'middle'

    const gradient =

    this.context.fillStyle = 'Aqua'
    this.context.fillText('AA', this.width * .5, this.height * .5)
  }

  init(){
    this.rows = Math.floor(this.height / this.cellSize)
    this.cols = Math.floor(this.width / this.cellSize)
    this.field = []

    this.drawText()

    const pixels = this.context.getImageData(0,0,this.width,this.height).data
    console.log(pixels)

    for(let y = 0; y <= this.height; y+= this.cellSize){
      for(let x = 0; x <= this.width; x+= this.cellSize){
        const index = (y * this.width + x) * 4
        const red = pixels[index]
        const green = pixels[index+1]
        const blue = pixels[index+2]
        const alpha = pixels[index+3]
        const grayscale = (red + green + blue) / 3
        const colorAngle = ((grayscale/255) * 6.28).toFixed(2)
        this.field.push({
          x: x,
          y: y,
          colorAngle: colorAngle
        })
      }
    }



    // for (let y = 0; y <= this.rows; y++){
    //   for (let x = 0; x <= this.cols; x++){
    //     // TODO Make each permutation of the operators and sin cos combinations
    //     let angle = (Math.sin(x *  this.zoom) + Math.cos(y * this.zoom)) + this.curve
    //     // let angle = (Math.sin(x +  this.zoom) + Math.cos(y * this.zoom)) * this.curve
    //     // let angle = (Math.sin(x +  this.zoom) + Math.cos(y + this.zoom)) * this.curve
    //     // let angle = (Math.sin(x +  this.zoom) + Math.cos(y + this.zoom)) + this.curve
    //     // let angle = (Math.sin(x -  this.zoom) + Math.cos(y + this.zoom)) + this.curve
    //     // let angle = (Math.sin(x -  this.zoom) - Math.cos(y + this.zoom)) + this.curve
    //     // let angle = (Math.sin(x -  this.zoom) - Math.cos(y - this.zoom)) + this.curve
    //     // let angle = (Math.sin(x -  this.zoom) - Math.cos(y - this.zoom)) - this.curve
    //     // let angle = (Math.sin(x /  this.zoom) - Math.cos(y - this.zoom)) - this.curve
    //     // let angle = (Math.sin(x /  this.zoom) / Math.cos(y - this.zoom)) - this.curve
    //     // let angle = (Math.sin(x /  this.zoom) / Math.cos(y / this.zoom)) - this.curve
    //     // let angle = (Math.sin(x /  this.zoom) / Math.cos(y / this.zoom)) / this.curve
    //     // let angle = (Math.sin(x *  this.zoom) - Math.cos(y / this.zoom)) / this.curve

    //     this.field.push(angle)
    //   }
    // }
    this.particles = []
    for (let i = 0; i <= this.numberOfParticles; i++){
      this.particles.push(new Particle(this))
    }
  }

  drawGrid(){
    this.context.save()
    this.context.strokeStyle = "#6667AB"
    this.context.lineWidth = .25
    for (let c = 0; c < this.cols; c++){
      this.context.beginPath()
      this.context.moveTo(this.cellSize * c, 0)
      this.context.lineTo(this.cellSize * c, this.height)
      this.context.stroke()
    }
    for (let r = 0; r < this.rows; r++){
      this.context.beginPath()
      this.context.moveTo(0,this.cellSize * r)
      this.context.lineTo(this.width, this.cellSize * r)
      this.context.stroke()
    }
    this.context.restore()
  }

  resize(width,height){
    this.canvas = canvas
    this.canvas.width = width
    this.canvas.height = height
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.init()
  }

  render(){
    if (this.debug) {
      this.drawGrid()
      this.drawText()
    }
    this.particles.forEach(particle => {
      particle.draw(this.context)
      particle.update()
    })
  }
}

const effect = new Effect(canvas, ctx)
animate()

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  effect.render()
  requestAnimationFrame(animate)
}