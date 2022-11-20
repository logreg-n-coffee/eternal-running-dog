export default class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Finlandica';
        this.lifeImage = document.getElementById('heart');
    }
    draw(context) {
        // wrap the whole draw method in save() and restore() so that the settings are only available here
        context.save();
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        // score
        context.fillText(`Score: ${this.game.score}`, 20, 50);
        // timer
        context.font = `${this.fontSize * 0.8}px ${this.fontFamily}`;
        context.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)}`, 20, 80);
        // energy level
        context.font = `${this.fontSize * 0.8}px ${this.fontFamily}`;
        context.fillText(`Energy: ${Math.floor(this.game.energy).toFixed(0)}`, 20, 110);
        // life
        for (let i = 0; i < this.game.lives; i++) {
            context.drawImage(this.lifeImage, 25 * i + 20, 125, 25, 25);
        }
        // bgm button
        if (this.game.background.playBGM && !this.game.pause) {
            context.textAlign = 'right';
            context.font = `${this.fontSize * 0.4}px ${this.fontFamily}`;
            context.fillText(
                'Press A - Turn off BGM',
                this.game.width,
                this.game.height - 2,
            );
        }
        if (!this.game.background.playBGM && !this.game.pause) {
            context.textAlign = 'right';
            context.font = `${this.fontSize * 0.4}px ${this.fontFamily}`;
            context.fillText(
                'Press A - Turn on BGM',
                this.game.width,
                this.game.height - 2,
            );
        }
        // debug mode display
        if (this.game.debug) {
            context.textAlign = 'right';
            context.font = `${this.fontSize * 0.4}px ${this.fontFamily}`;
            context.fillText(
                'DEBUG MODE IS ON',
                this.game.width,
                10,
            );
            context.fillText(
                'UNLIMITED LIFE AND ENERGY',
                this.game.width,
                20,
            );
            context.fillText(
                `Lives Reading: ${this.game.lives}`,
                this.game.width,
                30,
            );
        }
        // pause message 
        if (this.game.pause) {
            context.textAlign = 'center';
            context.font = `${this.fontSize * 2}px ${this.fontFamily}`;
            context.fillText(
                'Game Paused',
                this.game.width * 0.5,
                this.game.height * 0.5 - 20
            );
            context.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
            context.fillText(
                'Press P to continue',
                this.game.width * 0.5,
                this.game.height * 0.5 + 20
            );
        }

        // game over messages
        if (this.game.gameOver) {
            context.textAlign = 'center';
            context.font = `${this.fontSize * 2}px ${this.fontFamily}`;
            // if the game score meets winning score display victory message
            if (this.game.score >= this.game.winningScore) {
                context.fillText(
                    'Woo hoo',
                    this.game.width * 0.5,
                    this.game.height * 0.5 - 20
                );
                context.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
                context.fillText(
                    'Creatures of the night are afraid of YOU!!',
                    this.game.width * 0.5,
                    this.game.height * 0.5 + 20
                );
                context.font = `${this.fontSize * 0.5}px ${this.fontFamily}`;
                context.fillText(
                    `You crushed ${this.game.enemiesDestroyed} enemies.`,
                    this.game.width * 0.5,
                    this.game.height * 0.5 + 45
                );
            } else {
                // else display defeat message 
                context.fillText(
                    'Love at first bite?',
                    this.game.width * 0.5,
                    this.game.height * 0.5 - 20
                );
                context.font = `${this.fontSize * 0.7}px ${this.fontFamily}`;
                context.fillText(
                    'Nope! Better luck next time',
                    this.game.width * 0.5,
                    this.game.height * 0.5 + 20
                );
                context.font = `${this.fontSize * 0.5}px ${this.fontFamily}`;
                context.fillText(
                    `You crushed ${this.game.enemiesDestroyed} enemies.`,
                    this.game.width * 0.5,
                    this.game.height * 0.5 + 45
                );
            }
        } 
        context.restore();
    }
}