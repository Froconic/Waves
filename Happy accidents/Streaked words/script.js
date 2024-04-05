const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = 1000
canvas.height = 1000

// canvas.width = window.innerWidth
// canvas.height = window.innerHeight


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
    this.boost = Math.floor((Math.random() * 5) + 1)
    this.history = [{x: this.x, y: this.y}]
    this.maxLength = Math.floor((Math.random() * 11) + 22)
    this.timer = this.maxLength * 3
    this.angle = 0
    this.newAngle = 0
    this.angleCorrector = (Math.random() * .5) + .01
    // this.angleCorrector = this.angle * .1
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
        this.newAngle = this.effect.field[index].colorAngle
        if (this.angle > this.newAngle){
          this.angle -= this.angleCorrector
        } else if (this.angle < this.newAngle){
          this.angle += this.angleCorrector
        } else {
          this.angle = this.newAngle
        }
      }
      // Only Words
      this.speedX = Math.sin(this.angle)
      this.speedY = Math.sin(this.angle)
      // Outline words
      this.speedX = Math.cos(this.angle)
      this.speedY = Math.cos(this.angle)
      this.x += this.speedX * this.boost
      this.y += this.speedY * this.boost

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
    let attempts = 0
    let resetSuccess = false

    while (attempts < 20 && !resetSuccess){
      attempts++
      let test = Math.floor(Math.random() * this.effect.field.length)
      if (this.effect.field[test].alpha > 0){
        this.x = Math.floor(Math.random() * this.effect.width)
        this.y = Math.floor(Math.random() * this.effect.height)
        this.history = [{x: this.x, y: this.y}]
        this.timer = this.maxLength * 2
        resetSuccess = true
      }
    }
    if (!resetSuccess){
      this.x = Math.random() * this.effect.width
      this.y = Math.random() * this.effect.height
      this.history = [{x: this.x, y: this.y}]
      this.timer = this.maxLength * 2
    }
  }
}


class Effect {
  constructor(canvas, ctx){
    this.canvas = canvas
    this.context = ctx
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.particles = []
    this.numberOfParticles = 9000
    this.cellSize = 20
    this.rows
    this.cols
    this.field = []
    this.debug = false
    this.text = 'Magick'
    this.init();

    window.addEventListener('keydown', e => {
      if (e.key === 'd') this.debug = !this.debug
    })

    // window.addEventListener('resize', e => {
    //   // this.resize(e.target.innerWidth, e.target.innerHeight)
    // })
  }

  drawText(){
    this.context.font = '400px Roboto'
    this.context.textAlign = 'center'
    this.context.textBaseline = 'middle'

    const gradient = this.context.createLinearGradient(0,0,this.width,this.height)
    gradient.addColorStop(.5,'rgb(9,35,16)')
    gradient.addColorStop(.8,'rgb(99, 75, 218)')
    const gradient2 = this.context.createRadialGradient(this.height * .5, this.width * .5, 10,this.height * .5, this.width * .5, this.width)
    // gradient2.addColorStop(1,'rgb(214, 239, 255)')
    // gradient2.addColorStop(.8,'rgb(133, 208, 255)')
    // gradient2.addColorStop(.6,'rgb(51, 177, 255)')
    // gradient2.addColorStop(.4,'rgb(0, 138, 224)')
    // gradient2.addColorStop(.2,'rgb(0, 88, 143)')
    gradient2.addColorStop(.9,'rgb(0,0,255)')
    gradient2.addColorStop(.7,'rgb(200,255,0)')
    gradient2.addColorStop(.5,'rgb(0,0,255)')
    gradient2.addColorStop(.3,'rgb(0,0,0)')
    gradient2.addColorStop(.1,'rgb(255,255,255)')

    const gradient3 = this.context.createLinearGradient(0, 0, this.width, this.height)
        gradient3.addColorStop(0.2, 'rgb(255,255,0)')
        gradient3.addColorStop(0.4, 'rgb(200,5,50)')
        gradient3.addColorStop(0.6, 'rgb(150,255,255)')
        gradient3.addColorStop(0.8, 'rgb(255,255,150)')


    this.context.fillStyle = gradient3
    this.context.fillText(this.text, this.width * .5, this.height * .5, this.width * .9)
  }

  init(){
    this.rows = Math.floor(this.height / this.cellSize)
    this.cols = Math.floor(this.width / this.cellSize)
    this.field = []

    this.drawText()

    const pixels = this.context.getImageData(0,0,this.width,this.height).data
    console.log(pixels)

    for(let y = 0; y < this.height; y+= this.cellSize){
      for(let x = 0; x < this.width; x+= this.cellSize){
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
          alpha: alpha,
          colorAngle: colorAngle
        })
      }
    }

    this.particles = []
    for (let i = 0; i <= this.numberOfParticles; i++){
      this.particles.push(new Particle(this))
    }
    this.particles.forEach(particle => particle.reset())
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
    // this.context.fillStyle = 'rgba(255,255,255,0.05)'
    //     this.context.fillText(this.text, this.width * 0.5 - 5, this.height * 0.5 + 5, this.width)
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