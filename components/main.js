import Player from './player.js';
import { InputHandler } from './controls.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemy.js';
import { Carrot } from './replenishment.js';
import UI from './ui.js';

window.addEventListener('load', () => {
    // hide loading
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    // init canvas
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    // Game class
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.backgroundSpeed = 0;
            this.maxBackgroundSpeed = 5;
            this.gameSoundOn = true;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.enemiesDestroyed = 0;  // count the number of destroyed enemies (including all collisions)
            this.particles = [];
            this.maxParticles = 50;
            this.collisions = [];
            this.floatingMessages = [];
            this.replenishments = [];
            this.replenishmentTimer = 0;
            this.replenishmentInterval = 5000;
            this.replenishmentCount = 0;
            this.lives = 3;
            this.maxLives = 10;
            this.energy = 5;  // energy needed to become an invulnerable fireball
            this.debug = false;
            this.score = 0;
            this.winningScore = 40;
            this.fontColor = 'black';
            this.time = 0;  // game time
            this.maxTime = 100 * 1000;
            this.gameOver = false;
            this.pause = false;  // game pause status
            // when everything is loaded including Game class, Player class, etc, set current state accordingly and enter
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }

        update(deltaTime) {
            // time 
            this.time += deltaTime;
            if (this.time > this.maxTime && !this.debug) {
                // in debug mode, game will not be automatically over
                this.gameOver = true;
            }

            // energy level increases by deltaTime
            this.energy += deltaTime * 0.001;

            // background
            this.background.update();

            // player
            this.player.update(this.input.keys, deltaTime);

            // handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach((enemy) => {
                enemy.update(deltaTime);
            });
            // console.log(this.enemies);

            // handle replenishments
            if (this.replenishmentTimer > this.replenishmentInterval) {
                if (Math.random() < 0.5) {
                    // there will be a 0.5 possiblity of replenishment appearance 
                    this.replenishments.push(new Carrot(this));
                }
                
                this.replenishmentTimer = 0;
            } else {
                this.replenishmentTimer += deltaTime;
            }
            this.replenishments.forEach((rep) => {
                rep.update(deltaTime);
            });

            // handle floating messages
            this.floatingMessages.forEach((message) => {
                message.update();
            });

            // handle particles
            this.particles.forEach((particle) => {
                particle.update();
            });
            // limit the number of particles by slicing the particle list - remember to slice the old particles
            // so to work around with this we add front the beginnig of the particle array
            if (this.particles.length > this.maxParticles) {
                // this.particles = this.particles.slice(0, 50); // alternative
                this.particles.length = this.maxParticles;
            }
            // console.log(this.particles);

            // handle collision sprites
            this.collisions.forEach((collision) => {
                collision.update(deltaTime);
            });

            // filter out the enemies, particles, floating messages, and collisions to be deleted
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.replenishments = this.replenishments.filter(replenishment => !replenishment.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach((enemy) => enemy.draw(context));
            this.replenishments.forEach((rep) => rep.draw(context));
            this.particles.forEach((particle) => particle.draw(context));
            this.collisions.forEach((collision) => collision.draw(context));
            this.floatingMessages.forEach((message) => message.draw(context));
            this.ui.draw(context);
        }

        addEnemy() {
            // add ground enemy 
            if (this.backgroundSpeed > 0 && Math.random() < 0.5) {
                this.enemies.push(new GroundEnemy(this));
            } else if (this.backgroundSpeed > 0) {
                this.enemies.push(new ClimbingEnemy(this));
            }
            // add flying enemy
            this.enemies.push(new FlyingEnemy(this));
            // console.log(this.enemies);
        }
    }

    // instantiate Game class
    const game = new Game(canvas.width, canvas.height);
    // console.log(game);

    // fps control 
    let lastTime = 0;

    // animation loop
    (function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;  // for some computer 1000ms / 60Hz refresh rate = 16.67
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!game.pause) game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate);
    })(0);
});
