import CollisionAnimation from "./collisionAnimation.js";

export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];  // contains all current keys - track all active keys
        this.pressed = false;
        this.touchX = 0;
        this.touchY = 0;
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
        window.addEventListener('touchstart', (e) => {
            e.preventDefault();
            // touchstart fires when the user starts touching
            this.touchX = e.changedTouches[0].pageX;
            this.touchY = e.changedTouches[0].pageY;
        });
        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            // touchmove keeps firing when user keeps touching
            const swipeXDistance = e.changedTouches[0].pageX - this.touchX;
            const swipeYDistance = e.changedTouches[0].pageY - this.touchY;
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
        });
        window.addEventListener('touchend', (e) => {
            e.preventDefault();
            // clean up
            this.keys.splice(this.keys.indexOf('ArrowLeft'), 1);
            this.keys.splice(this.keys.indexOf('ArrowRight'), 1);
            this.keys.splice(this.keys.indexOf('ArrowUp'), 1);
            this.keys.splice(this.keys.indexOf('ArrowDown'), 1);
        });
    }
}
