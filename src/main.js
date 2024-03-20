class Boid{
    constructor(){
        this.pos = {x: window.screen.width * Math.random(), y: window.screen.height * Math.random()}
        this.vel = {x: Math.random()-.5, y: Math.random()-.5}
        this.el = document.createElement('div')
        this.el.className = 'boid'
        this.el.style.position = "absolute"
        this.el.style.width = "0px"
        this.el.style.height = "0px"
        this.el.style.borderLeft = "3px solid transparent"
        this.el.style.borderRight = "3px solid transparent"
        this.el.style.borderBottom = "8px solid white"
        document.body.appendChild(this.el)
    }

    update(){
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    draw(){
        this.el.style.left = `${Math.round(this.pos.x)}px`
        this.el.style.top = `${this.pos.y}px`

        const angle = 180 * Math.atan2(this.vel.y, this.vel.x) / Math.PI + 90
        this.el.style.transform = `rotateZ(${angle}deg)`
    }
}

class Manager{
    constructor(){
        this.boids = []
        // make 100 boids
        for (let index = 0; index < 100; index++) {
            this.boids.push(new Boid())
        }

        console.log("created 100 boids")
        console.log(this.boids)
    }
    
    update(){
        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i]
            boid.update()
        }
    }

    draw(){
        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i]
            boid.draw()
        }
    }
}

let manager = new Manager()

function loop(){
    manager.update()
    manager.draw()
}
setInterval(loop, 20)