import { Dust, Fire, Splash } from './particle.js';
import { StaticMessage } from './floatingMessage.js';

export const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6,
};

class State {
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }
}

export class Sitting extends State {
    constructor(game) {
        super('SITTING', game);
    }

    enter() {
        this.game.player.frameX = 0;  // reset the frameX to avoid fast state transition causing white flash effect
        this.game.player.maxFrame = 4;
        this.game.player.frameY = 5;
    }

    handleInput(input) {
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes(' ')) {
            if (this.game.energy > 1) {
                this.game.player.setState(states.ROLLING, 2);
            } else {
                this.game.floatingMessages.push(
                    new StaticMessage('Energy', 24, 107)
                );
            }
        }
    }
}

export class Running extends State {
    constructor(game) {
        super('RUNNING', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 8;
        this.game.player.frameY = 3;
    }

    handleInput(input) {
        // particle effect when running
        this.game.particles.unshift(
            new Dust(
                this.game, 
                this.game.player.x + this.game.player.width * 0.5, 
                this.game.player.y + this.game.player.height
                )
        );
        if (input.includes('ArrowDown')) {
            this.game.player.setState(states.SITTING, 0);
        } else if (input.includes('ArrowUp')) {
            this.game.player.setState(states.JUMPING, 1);
        } else if (input.includes(' ')) {
            if (this.game.energy > 1) {
                this.game.player.setState(states.ROLLING, 2);
            } else {
                this.game.floatingMessages.push(
                    new StaticMessage('Energy', 24, 107)
                );
            }
        }
    }
}


export class Jumping extends State {
    constructor(game) {
        super('JUMPING', game);
    }

    enter() {
        if (this.game.player.isOnGround()) {
            this.game.player.velocityY -= 27;
        }
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 1;
    }

    handleInput(input) {
        if (this.game.player.velocityY > this.game.player.weight) {
            this.game.player.setState(states.FALLING, 1);
        } else if (input.includes(' ')) {
            if (this.game.energy > 1) {
                this.game.player.setState(states.ROLLING, 2);
            } else {
                this.game.floatingMessages.push(
                    new StaticMessage('Energy', 24, 107)
                );
            }
        } else if (input.includes('ArrowDown')) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Falling extends State {
    constructor(game) {
        super('FALLING', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;
    }

    handleInput(input) {
        if (this.game.player.isOnGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes('ArrowDown')) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Rolling extends State {
    constructor(game) {
        super('ROLLING', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
    }

    handleInput(input) {
        // particle effect when running - add to the beginning of the particle array
        this.game.particles.unshift(
            new Fire(
                this.game,
                this.game.player.x + this.game.player.width * 0.5,
                this.game.player.y + this.game.player.height
            )
        );
        if (!input.includes(' ') && this.game.player.isOnGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (!input.includes(' ') && !this.game.player.isOnGround()) {
            this.game.player.setState(states.FALLING, 1);
        } else if (
            input.includes(' ') &&
            input.includes('ArrowUp') &&
            this.game.player.isOnGround()
        ) {
            this.game.player.velocityY -= 27;
        } else if (input.includes('ArrowDown') && !this.game.player.isOnGround()) {
            // can only dive when the player is not on the ground
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Diving extends State {
    constructor(game) {
        super('DIVING', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;
        this.game.player.velocityY = 15;
    }

    handleInput(input) {
        // particle effect when running - add to the beginning of the particle array
        this.game.particles.unshift(
            new Fire(
                this.game,
                this.game.player.x + this.game.player.width * 0.5,
                this.game.player.y + this.game.player.height
            )
        );
        if (this.game.player.isOnGround()) {
            // set to running state
            this.game.player.setState(states.RUNNING, 1);
            // when the player touches the ground, set splash effect 30 times
            for (let i = 0; i < 30; i++) {
                this.game.particles.unshift(
                    new Splash(
                        this.game,
                        this.game.player.x + this.game.player.width * 0.5,
                        this.game.player.y + this.game.player.height
                    )
                );
            }
        } else if (!input.includes(' ') && !this.game.player.isOnGround()) {
            if (this.game.energy > 1) {
                this.game.player.setState(states.ROLLING, 2);
            } else {
                this.game.floatingMessages.push(
                    new StaticMessage('Energy', 24, 107)
                );
            }
        }
    }
}

export class Hit extends State {
    constructor(game) {
        super('HIT', game);
    }

    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 10;
        this.game.player.frameY = 4;
    }

    handleInput(input) {
        // the state will automatically be over once it has finished its animation
        if (
            this.game.player.frameX >= this.game.player.maxFrame &&
            this.game.player.isOnGround()
        ) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (
            this.game.player.frameX >= this.game.player.maxFrame &&
            !this.game.player.isOnGround()
        ) {
            this.game.player.setState(states.FALLING, 1);
        }
    }
}
