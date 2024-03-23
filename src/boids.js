class Boid{
    constructor(){
        this.group_velocity = {x: 0, y: 0};
        this.group_position = {x: 0, y: 0};
        this.group_size = 0;
        this.pos = {
            x: window.visualViewport.width / 2, 
            y: window.visualViewport.height / 2
        };
        this.vel = {
            x: (Math.random()-0.5), 
            y: (Math.random()-0.5)
        };
        this.el = document.createElement('div');
        this.el.className = 'boid';
        this.el.style.position = "absolute";
        this.el.style.width = "0px";
        this.el.style.height = "0px";
        this.el.style.borderLeft = "3px solid transparent";
        this.el.style.borderRight = "3px solid transparent";
        this.el.style.borderBottom = `10px solid hsl(${Math.round(360 * Math.random())}, 70%, 70%)`;
        document.body.appendChild(this.el);
    }

    update(manager){
        this.group_velocity = {x: 0, y: 0};
        this.group_position = {x: 0, y: 0};
        this.group_size = 0;
        
        for (let i = 0; i < manager.boids.length; i++) {
            let boid = manager.boids[i];
            let disp = Math.sqrt(Math.pow(this.pos.x - boid.pos.x, 2) + Math.pow(this.pos.y - boid.pos.y, 2));
            if (disp > 0 && disp <= manager.personal_space) {
                this.vel.x += manager.separation_force * (this.pos.x - boid.pos.x);
                this.vel.y += manager.separation_force * (this.pos.y - boid.pos.y);
            }
            if (disp > manager.personal_space && disp < manager.vision) {
                this.group_velocity.x += boid.vel.x;
                this.group_velocity.y += boid.vel.y;
                this.group_position.x += boid.pos.x;
                this.group_position.y += boid.pos.y;
                this.group_size++;
            }
        }
        if (this.group_size > 0){
            this.group_velocity.x /= this.group_size;
            this.group_velocity.y /= this.group_size;
            this.vel.x += manager.alignment_force * (this.group_velocity.x - this.vel.x)
            this.vel.y += manager.alignment_force * (this.group_velocity.y - this.vel.y)
            this.group_position.x /= this.group_size;
            this.group_position.y /= this.group_size;
            this.vel.x += manager.cohesion_force * (this.group_position.x - this.pos.x)
            this.vel.y += manager.cohesion_force * (this.group_position.y - this.pos.y)
        }

        const speed = Math.sqrt(Math.pow(this.vel.x, 2) + Math.pow(this.vel.y, 2))

        if (speed > manager.max_speed){
            this.vel.x *= manager.max_speed / speed
            this.vel.y *= manager.max_speed / speed
        }
        if (speed < manager.min_speed){
            this.vel.x *= manager.min_speed / speed
            this.vel.y *= manager.min_speed / speed
        }

        if (this.pos.x < 30) this.vel.x += manager.screen_steer
        if (this.pos.x > window.screen.width - 30) this.vel.x -= manager.screen_steer
        if (this.pos.y < 30) this.vel.y += manager.screen_steer
        if (this.pos.y > window.screen.height - 30) this.vel.y -= manager.screen_steer

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    draw(){
        this.el.style.left = `${this.pos.x}px`;
        this.el.style.top = `${this.pos.y}px`;

        const angle = 180 * Math.atan2(this.vel.y, this.vel.x) / Math.PI + 90;
        this.el.style.rotate = `${angle}` + "deg";
    }
}

class Manager{
    constructor(){
        this.personal_space = 8;
        this.vision = 40;
        this.separation_force = 0.05;
        this.alignment_force = 0.05;
        this.cohesion_force = 0.0009;
        this.screen_steer = 0.2;
        this.max_speed = 6;
        this.min_speed = 2

        this.boids = []
        for (let index = 0; index < 500; index++) {
            this.boids.push(new Boid());
        }
    }
    
    update(){
        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
            boid.update(manager);
        }
    }

    draw(){
        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
            boid.draw();
        }
    }
}

let manager = new Manager();

function loop(){
    manager.update();
    manager.draw();
}


setInterval(loop, 30);
