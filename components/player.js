import {
    states,
    Sitting,
    Running,
    Jumping,
    Falling,
    Rolling,
    Diving,
    Hit,
} from './playerState.js';

import CollisionAnimation from './collisionAnimation.js';
import { DynamicMessage } from './floatingMessage.js';

export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('player');
        // spritesheet animation
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 5;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        // x, y movement
        this.velocityX = 0;
        this.maxVelocityX = 10;
        this.velocityY = 0;
        this.weight = 1;
        // state management
        this.states = [
            new Sitting(this.game),
            new Running(this.game),
            new Jumping(this.game),
            new Falling(this.game),
            new Rolling(this.game),
            new Diving(this.game),
            new Hit(this.game),
        ];
        this.currentState = null;
    }
    update(input, deltaTime) {
        // check collision
        this.checkCollision();
        // handleInput
        this.currentState.handleInput(input);
        // horizontal movement - applies in every state - left and right inputs
        // left and right inputs will be disabled when the player is hit
        this.x += this.velocityX;
        if (
            input.includes('ArrowRight') &&
            this.currentState !== this.states[states.HIT]
        ) {
            this.velocityX = this.maxVelocityX;
        } else if (
            input.includes('ArrowLeft') &&
            this.currentState !== this.states[states.HIT]
        ) {
            this.velocityX = -this.maxVelocityX;
        } else {
            this.velocityX = 0;
        }
        // left and right boundaries
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > this.game.width - this.width) {
            this.x = this.game.width - this.width;
        }
        // vertical movement
        this.y += this.velocityY;
        if (!this.isOnGround()) {
            this.velocityY += this.weight;
        } else {
            this.velocityY = 0;
        }
        // bottom boundary
        if (this.y > this.game.height - this.height - this.game.groundMargin) {
            this.y = this.game.height - this.height - this.game.groundMargin;
        }
        // deltaTime operation - sprite animation and superpower constrain
        if (this.frameTimer > this.frameInterval) {
            // animate sprite sheet
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            // superpower energy level decrease in the rolling state
            if (this.currentState === this.states[states.ROLLING] && !this.game.debug) {
                // when debug mode is enabled, energy level will not decrease
                this.game.energy -= 0.25;
            }
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        // detect energy level in rolling state and force back to other states when energy is low
        if (this.currentState === this.states[states.ROLLING] && this.game.energy <= 0) {
            if (this.isOnGround()) {
                this.setState(states.SITTING, 0);
            } else if (!this.isOnGround()) {
                this.setState(states.FALLING, 1);
            }
        }
    }
    draw(context) {
        // context.fillStyle = 'red';
        // context.fillRect(this.x, this.y, this.width, this.height);
        // debug mode
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
        context.drawImage(
            this.image,
            this.frameX * this.width,
            this.frameY * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
    isOnGround() {
        return (
            this.y >= this.game.height - this.height - this.game.groundMargin
        );
    }
    setState(state, backgroundSpeed) {
        this.currentState = this.states[state];
        this.game.backgroundSpeed =
            this.game.maxBackgroundSpeed * backgroundSpeed;
        this.currentState.enter();
    }
    checkCollision() {
        this.game.enemies.forEach((enemy) => {
            // detected collision
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                // if collision is detected, enemy will be deleted no matter what
                enemy.markedForDeletion = true;
                // increase the counter for destroyed enemies
                this.game.enemiesDestroyed++;
                // while the enemy is deleted, the collision animation will play 
                this.game.collisions.push(
                    new CollisionAnimation(
                        this.game,
                        enemy.x + enemy.width * 0.5,  // center the collision animation by offsetting width
                        enemy.y + enemy.height * 0.5,  // center the collision animation by offsetting height
                    )
                );
                // if the player is in the following states, they are invulnerable
                if (
                    this.currentState === this.states[states.ROLLING] ||
                    this.currentState === this.states[states.DIVING]
                ) {
                    // after the ememy is destroyed in invulnerable state, add 1 to score
                    this.game.score++;
                    // display floating message effect
                    this.game.floatingMessages.push(
                        new DynamicMessage('+1', enemy.x, enemy.y, 0, 0)
                    );
                    // increase the energy level by 0.5
                    this.game.energy += 1;
                } else {
                    // will not add 1 to score
                    // the player will get hit and will play the hit animation (in hit state)
                    this.setState(states.HIT, 0);
                    // if collision occured, penalty on score can be levied 
                    this.game.score--;  // or this.game.score -= 1
                    // lives will drop down by 1 and if the total lives drops below 0, game will be over
                    this.game.lives--;
                    if (this.game.lives <= 0 && !this.game.debug) {
                        // when the debug mode is enabled, game will not be over when the lives are dropped below 0
                        this.game.gameOver = true;
                    }
                }
            }
        });
        this.game.replenishments.forEach((rep) => {
            // detected collision
            if (
                rep.x < this.x + this.width &&
                rep.x + rep.width > this.x &&
                rep.y < this.y + this.height &&
                rep.y + rep.height > this.y
            ) {
                // if collision is detected, enemy will be deleted no matter what
                rep.markedForDeletion = true;
                // increase the counter for replenishment
                this.replenishmentCount++;
                // while the replenishment is collected, the collision animation will play 
                this.game.collisions.push(
                    new CollisionAnimation(
                        this.game,
                        rep.x + rep.width * 0.5,  // center the collision animation by offsetting width
                        rep.y + rep.height * 0.5,  // center the collision animation by offsetting height
                    )
                );
                // replenishment will take effect
                if (this.game.lives < this.game.maxLives) {
                    this.game.lives += 1;
                }
                this.game.energy += 2;
                // floating message
                this.game.floatingMessages.push(
                    new DynamicMessage('life +1', rep.x, rep.y, 0, 0)
                );
            }
        });
    }
}
