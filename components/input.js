import CollisionAnimation from "./collisionAnimation.js";

export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];  // contains all current keys - track all active keys
        window.addEventListener('keydown', (e) => {
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
    }
}
