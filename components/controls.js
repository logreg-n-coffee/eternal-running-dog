import CollisionAnimation from "./collisionAnimation.js";

export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];  // contains all current keys - track all active keys
        this.pressed = false;
        this.touchX = 0;
        this.touchY = 0;
        this.leftTouchID = -1;  // record the left division of the window 
        this.touchTreshold = 28;
        // keyboard events
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            if (
                (e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === ' ') &&
                this.keys.indexOf(e.key) === -1
            ) {
                this.keys.push(e.key);
            } else if (e.key === 'd') {
                // debug mode switch
                this.game.debug = !this.game.debug;
            } else if (e.key === 'r') {
                // press r to restart the game
                window.location.reload();
            } else if (e.key === 'p') {
                // press p to pause/unpause the game
                this.game.pause = !this.game.pause;
            } else if (e.key === 'a') {
                // play bgm switch
                this.game.background.playBGM = !this.game.background.playBGM;
            } else if (e.key === 'q' && this.game.debug) {
                // **** cheat code = disqualify (DQ) all enemies ****
                this.game.enemies.forEach(enemy => {
                    this.game.collisions.push(
                        new CollisionAnimation(
                            this.game,
                            enemy.x + enemy.width * 0.5,  // center the collision animation by offsetting width
                            enemy.y + enemy.height * 0.5,  // center the collision animation by offsetting height
                        )
                    );
                    enemy.markedForDeletion = true;
                });
            }
            // console.log(e.key);
        });
        window.addEventListener('keyup', (e) => {
            e.preventDefault();
            if (
                e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === ' '
            ) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
        // touch screen events
        window.addEventListener(
            'touchstart',
            (e) => {
                e.preventDefault();

                // touchstart fires when the user starts touching
                for (let i = 0; i < e.changedTouches.length; i++) {
                    const touch = e.changedTouches[i];
                    // split the touches from the left division (30%) and right division (70%)
                    if (
                        this.leftTouchID < 0 &&
                        touch.clientX < this.game.width * 0.3
                    ) {
                        this.leftTouchID = touch.identifier; // record the left touch ID
                        // start the fireball state
                        if (this.keys.indexOf(' ') === -1) {
                            this.keys.push(' ');
                            continue;
                        }
                    } else {
                        this.touchX = touch.pageX;
                        this.touchY = touch.pageY;
                    }
                }
            },
            {
                passive: false,
            }
        );
        window.addEventListener(
            'touchmove',
            (e) => {
                e.preventDefault();

                for (let i = 0; i < e.changedTouches.length; i++) {
                    const touch = e.changedTouches[i];

                    if (this.leftTouchID === touch.identifier) {
                        // do the fireball state when the touch is on the left side
                        if (this.keys.indexOf(' ') === -1) {
                            this.keys.push(' ');
                            continue;
                        }
                    } else {
                        // for touches outside of the left division - controls
                        // touchmove keeps firing when user keeps touching
                        const swipeXDistance = touch.pageX - this.touchX;
                        const swipeYDistance = touch.pageY - this.touchY;
                        // swipe left and right
                        if (
                            swipeXDistance < -this.touchTreshold &&
                            this.keys.indexOf('ArrowLeft') === -1
                        ) {
                            this.keys.push('ArrowLeft');
                        } else if (
                            swipeXDistance > this.touchTreshold &&
                            this.keys.indexOf('ArrowRight') === -1
                        ) {
                            this.keys.push('ArrowRight');
                        }
                        // swipe up and down
                        if (
                            swipeYDistance < -this.touchTreshold &&
                            this.keys.indexOf('ArrowUp') === -1
                        ) {
                            this.keys.push('ArrowUp');
                        } else if (
                            swipeYDistance > this.touchTreshold &&
                            this.keys.indexOf('ArrowDown') === -1
                        ) {
                            this.keys.push('ArrowDown');
                        }
                    }
                }
            },
            {
                passive: false,
            }
        );
        window.addEventListener(
            'touchend',
            (e) => {
                e.preventDefault();
                // restore the leftTouch identifier
                for (let i = 0; i < e.changedTouches.length; i++) {
                    const touch = e.changedTouches[i];
                    if (this.leftTouchID === touch.identifier) {
                        // restore the leftTouch identifier after the touch ends
                        this.leftTouchID = -1;
                        this.keys.splice(this.keys.indexOf(' '), 1);
                    } else {
                        // clean up the effects brought by the right division of the window
                        this.keys.splice(this.keys.indexOf('ArrowLeft'), 1);
                        this.keys.splice(this.keys.indexOf('ArrowRight'), 1);
                        this.keys.splice(this.keys.indexOf('ArrowUp'), 1);
                        this.keys.splice(this.keys.indexOf('ArrowDown'), 1);
                    }
                }
            },
            {
                passive: false,
            }
        );
    }
}
