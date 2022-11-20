export default class CollisionAnimation {
    constructor(game, x, y) {
        this.game = game;
        this.image = document.getElementById('boom');
        this.spriteWidth = 100;
        this.spriteHeight = 90;
        this.sizeModifier = Math.random() + 0.5;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.frameX = 0;
        this.maxFrame = 4
        this.markedForDeletion = false;
        this.fps = Math.random() * 10 + 5;  // fps can be a const number such as 15, we can also randomize it
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }

    draw(context) {
        context.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height,
        );
    }

    update(deltaTime) {
        // offset the background to keep the collision look like it is "staying in the original position"
        this.x -= this.game.backgroundSpeed;

        // animate the sprite sheet based on the set fps
        if (this.frameTimer > this.frameInterval) {
            this.frameX++;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        // console.log('deltaTime', deltaTime);
        // console.log('this.frameTimer', this.frameTimer);
        // console.log('this.frameInterval', this.frameInterval);

        // if the animation is finished, it is automatically deleted
        if (this.frameX > this.maxFrame) {
            this.markedForDeletion = true;
        }
    }
}