class FloatingMessage {
    constructor(value, x, y) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.markedForDeletion = false;
        this.timer = 0; // internal timer within the floating message
    }

    update() {
        // make the message approach the target position
        this.timer++;
        if (this.timer > 100) this.markedForDeletion = true;
    }

    draw(context) {
        context.font = '20px Finlandica';
        context.fillStyle = 'white';
        context.fillText(this.value, this.x, this.y);
        context.fillStyle = 'black';
        context.fillText(this.value, this.x + 2, this.y + 2);
    }
}

export class StaticMessage extends FloatingMessage {
    constructor(value, x, y) {
        super(value, x, y);
    }

    update() {
        super.update();
    }

    draw(context) {
        context.font = '24px Finlandica';
        context.fillStyle = 'red';
        context.fillText(this.value, this.x, this.y);
    }
}

export class DynamicMessage extends FloatingMessage {
    constructor(value, x, y, targetX, targetY) {
        super(value, x, y);
        this.targetX = targetX;
        this.targetY = targetY;
    }

    update() {
        super.update();
        // make the message approach the target position
        this.x += (this.targetX - this.x) * 0.03;
        this.y += (this.targetY - this.y) * 0.03;
    }

    draw(context) {
        super.draw(context);
    }
}
