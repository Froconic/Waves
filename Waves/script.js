const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = 900
canvas.height = 900


// TODO Test other colors in stroke and fill
ctx.fillStyle = 'white'
ctx.strokeStyle = 'white'
ctx.lineWidth = 1
ctx.linecap = 'round'


// Change the math floor to get decimals
class Particle {
  constructor(effect){
    this.effect = effect
    this.x = Math.floor(Math.random() * this.effect.width)
    this.y = Math.floor(Math.random() * this.effect.height)
    this.speedX = 0
    this.speedY = 0
    this.boost = Math.floor((Math.random() * 2) + 1)
    this.history = [{x: this.x, y: this.y}]
    this.lineWidth = .5
    this.maxLength = Math.floor((Math.random() * 33) + 55)
    this.timer = this.maxLength * 3
    this.opacity = 1
    this.angle
    this.oldAngle
    // this.newAngle
    this.angleCorrector = (Math.random() * .5) + .01618
    // this.angleCorrector = this.angle * .1
    this.colors = ['#D6EFFF','#85D0FF', '#33B1FF', '#008AE0', '#00588F']
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
    this.red = 0
    this.green = 0
    this.blue = 0
    this.oldRed = 0
    this.oldGreen = 0
    this.oldBlue = 0
  }
  draw(context){
    context.save()
    context.globalAlpha = this.opacity
    context.lineWidth = this.lineWidth
    context.strokeStyle = this.color
    context.fillStyle = this.color
    context.beginPath()
    context.moveTo(this.history[0].x, this.history[0].y)
    for (let i = 0; i < this.history.length; i++){
      context.lineTo(this.history[i].x,this.history[i].y)
    }
    context.stroke()
    context.restore()
  }
  // Multiply the speed to get circles
  // Add the speed to get lines
  update(){
    this.timer --
    if (this.x >= this.effect.width || this.x <= 0 || this.y >= this.effect.height || this.y <= 0){
      this.opacity -= .05
    }
    else if ( this.timer <= 0){
      this.opacity -= .05
    if (this.opacity <= .1){
      this.reset()
    }
    }


    let x = Math.floor(this.x / this.effect.cellSize)
    let y = Math.floor(this.y/ this.effect.cellSize)
    let index = y * Math.floor(canvas.width/this.effect.cellSize) + x
    if (this.effect.field[index])
    {
      this.oldAngle = this.angle
      this.newAngle = this.effect.field[index].colorAngle
      // Regular
      if (this.oldAngle > this.newAngle){
        this.angle -= this.angleCorrector
      } else if (this.oldAngle < this.newAngle){
        this.angle += this.angleCorrector
      } else {
        this.angle = this.effect.field[index].colorAngle

        if (this.effect.field[index].alpha > 0) {
          this.red += (this.effect.field[index]. red - this.red) * .02
          this.green += (this.effect.field[index]. green - this.green) * .02
          this.blue += (this.effect.field[index]. blue - this.blue) * .02
          this.color = 'rgb(' +this.red + ',' + this.green + ',' + this.blue + ')'
        }
      }
    }


    // this.speedX = Math.cos(this.angle)
    // this.speedY = Math.sin(this.angle)
    // this.x += this.speedX * this.boost
    // this.y += this.speedY * this.boost

    this.speedX = this.boost * Math.cos(this.angle)
    this.speedY = this.boost * Math.sin(this.angle)
    this.x += this.speedX
    this.y += this.speedY


    this.history.push({x: this.x, y: this.y})
  if (this.history.length > this.maxLength){
    this.history.shift()
  }
    }
  reset(){
    this.history = []
    this.timer = this.maxLength * 3
    this.opacity = 1
    let attempts = 0
    let resetSuccess = false
    // < 100 makes it scatter outside the words
    while (attempts < 80 && !resetSuccess){
      attempts++
      let test = Math.floor(Math.random() * this.effect.field.length)
      if (this.effect.field[test].colorAngle > 0){
        this.x = this.effect.field[test].x
        this.y = this.effect.field[test].y
        resetSuccess = true
      }
    }
    if (!resetSuccess){
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
    }
  }
}


class Effect {
  constructor(canvas, context){
    this.canvas = canvas
    this.context = ctx
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.particles = []
    this.numberOfParticles = 2000
    this.cellSize = 2
    this.rows
    this.cols
    this.field = []
    this.debug = false
    this.image = document.getElementById('image1')

    window.addEventListener('keydown', e => {
      if (e.key === 'd') this.debug = !this.debug
    })
  }


  init(){
    this.rows = Math.floor(this.height / this.cellSize)
    this.cols = Math.floor(this.width / this.cellSize)
    this.field = []
    this.context.drawImage(this.image, this.width * .5 - this.image.width * .5,this.height * .5 - this.image.height * .5)
    const pixels = this.context.getImageData(0,0,this.width,this.height).data
    console.log(pixels)

    for(let y = 0; y < this.height; y+= this.cellSize){
      for(let x = 0; x < this.width; x+= this.cellSize){
        const index = (y * this.width + x) * 4
        const red = pixels[index]
        const green = pixels[index+1]
        const blue = pixels[index+2]
        const alpha = pixels[index+3]
        const color = 'rgb('+ red + ',' + green + ',' + blue + ')'
        const grayscale = (red + green + blue) / 3
        const grayScaleColor = 'rgb('+ grayscale + ',' + grayscale + ',' + grayscale + ')'
        // TODO Play with multiplier on the color angle
        const colorAngle = ((grayscale/255) * 6.28).toFixed(5) * 1.5
        this.field.push({
          x: x,
          y: y,
          color: color,
          grayscale:grayscale,
          colorAngle: colorAngle,
          alpha: alpha,
          red: red,
          green: green,
          blue: blue,
        })
      }
    }

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

  render(){
    if (this.debug) {
      this.drawGrid()
      this.drawText()
    }

    this.context.fillStyle = 'rgba(0,0,0,1)'
    this.context.fillRect(0,0,this.width,this.height)
    // this.context.fillStyle = 'rgba(255,255,255,0.05)'
    //     this.context.fillText(this.text, this.width * 0.5 - 5, this.height * 0.5 + 5, this.width)
    this.particles.forEach(particle => {
      particle.update()
      particle.draw(this.context)
    })
  }
}

const effect = new Effect(canvas, ctx)
effect.init()
effect.render()

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  effect.render()
  requestAnimationFrame(animate)
}
animate()