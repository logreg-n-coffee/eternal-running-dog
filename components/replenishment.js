class Replenishment {
    constructor() {
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        // movement 
        this.x += this.velocityX - this.game.backgroundSpeed;  // movement and background speed sync
        this.y += this.velocityY;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
        } else {
            this.frameTimer += deltaTime;
        }
        // set the property to delete the enemy if it moves off the screen
        if (this.x + this.width < 0) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        // debug rectangle
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
        context.drawImage(
            this.image,
            this.frameX * this.width,
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height,
        );
    }
}

export class Carrot extends Replenishment {
    constructor(game) {
        super();
        this.game = game;
        this.width = 61.2;
        this.height = 60;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.velocityX = -(Math.random() + 1);
        this.velocityY = Math.random() < 0.5? Math.random() < 0.5? Math.random() - 1: Math.random() + 1: 0;
        this.angle = 0;
        this.angleVelocity = Math.random() * 0.1 + 0.1;
        this.maxFrame = 19;
        this.image = document.getElementById('carrot');
    }
    update(deltaTime) {
        super.update(deltaTime);
        // sine wave movement
        this.angle += this.angleVelocity;
        this.y += Math.sin(this.angle);
    }
}
