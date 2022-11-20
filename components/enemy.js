class Enemy {
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

export class FlyingEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 60;
        this.height = 44;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.velocityX = -(Math.random() + 1);
        this.velocityY = 0;
        this.angle = 0;
        this.angleVelocity = Math.random() * 0.1 + 0.1;
        this.maxFrame = 5;
        this.image = document.getElementById('enemy_fly');
    }
    update(deltaTime) {
        super.update(deltaTime);
        // sine wave movement
        this.angle += this.angleVelocity;
        this.y += Math.sin(this.angle);
    }
}

export class GroundEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('enemy_plant');
        this.velocityX = 0;
        this.velocityY = 0;
        this.maxFrame = 1;
    }
}

export class ClimbingEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.image = document.getElementById('enemy_spider_big');
        this.velocityX = 0;
        this.velocityY = Math.random() > 0.5 ? 1 : -1;
        this.maxFrame = 5;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        // bounce back if it hits the ground
        if (this.y > this.game.height - this.height - this.game.groundMargin) {
            this.velocityY *= -1;
        }
        // delete the spider if it moves out from the screen
        if (this.y < - this.height) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        super.draw(context);
        context.beginPath();
        context.moveTo(this.x + this.width / 2, 0);
        context.lineTo(this.x + this.width / 2, this.y + 50);
        context.stroke();
    }
}