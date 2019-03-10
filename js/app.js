// Enemies our player must avoid


// Variables applied to each of our instances go here,
// we've provided one for you to get started

// The image/sprite for our enemies, this uses
// a helper we've provided to easily load images

class Entity {
    constructor({ x = 0, y = 0, speed = 50, sprite = '', width = 70, height = 70 } = {}) {
        this._x = x;
        this._y = y;
        this._speed = speed;
        this._sprite = sprite;
        this._width = width;
        this._height = height;
    }

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get speed() {
        return this._speed;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get sprite() {
        return this._sprite;
    }


    set speed(speed) {
        this._speed = speed;
    }
    set x(posX) {
        this._x = posX;
    }
    set y(posY) {
        this._y = posY;
    }
    set sprite(sprite) {
        this._sprite = sprite;
    }
    set height(val) {
        this._height = val;
    }
    set width(val) {
        this._width = val;
    }




    update(dt) {

    };

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
}


class Enemy extends Entity {
    constructor({ x = 200, y = 100, speed = 50, sprite = 'images/enemy-bug.png', player = {}, width = 80, height = 51 } = {}) {
        super({ x, y, speed, sprite, width, height });
        this.player = player;
        this.initialXposition = x;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        super.update(dt);
        // You should multiply any movement by the dt parameter
        this.x += this.speed * dt;

        // which will ensure the game runs at the same speed for
        // all computers.
        if (this.isColiding()) {
            let bite = new Audio();
            bite.src = "sounds/bite.mp3";
            bite.play();
            player.reset();
        }

    };

    //i used code presented in https://tutorialedge.net/gamedev/aabb-collision-detection-tutorial/
    isColiding() {

        if (this.x < this.player.x + this.player.width &&
            this.x + this.width > this.player.x &&
            this.y < this.player.y + this.player.height &&
            this.y + this.height > this.player.y) {

            return true;
        }
        return false;
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player extends Entity {
    constructor({ x = 450, y = 450, speed = 50, sprite = 'images/char-boy.png' } = {}, width = 70, height = 70) {
        super({ x, y, speed, sprite, width, height });
        this.initialPosX = x;
        this.isGameWon = false;
        this.initialPosY = y;
    }

    //reset position of player if game won
    reset() {
        this._x = this.initialPosX;
        this._y = this.initialPosY;
    }


    update(dt) {
        super.update(dt);

        //check current position if exceeded screen put it back
        if (this.x > 400) {
            this.x = 400;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.y > 450) {
            this.y = 450;
        }


        //check y    at water //game won 
        if (this.y <= 0) {
            this.y = 0;
            alert('congratulations you won the game');
            let winning = new Audio();
            winning.src = "sounds/win.mp3";
            winning.play();
            this.isGameWon = true;
            this.reset();
        }

    };
    handleInput(key) {
        if (key == 'left') {
            this.x -= 50;
        }
        else if (key == 'right') {
            this.x += 50;
        }
        else if (key == 'up') {
            this.y -= 50;
        }
        else if (key == 'down') {
            this.y += 50;
        }
    }
}




class Collectable extends Entity {
    constructor({ x = 200, y = 100, speed = 0, sprite = 'images/Star.png', player = {} } = {}) {
        super({ x: x, y: y, speed: speed, sprite: sprite });
        this.player = player;
    }
    update(dt) {
        super.update(dt);

        if (this.isColiding()) {
            this.x = NaN;
            this.y = NaN;
            let eat = new Audio();
            eat.src = "sounds/eat.mp3";
            eat.play();
        }
    }


    isColiding() {
        var a = player.x - this.x;
        var b = player.y - this.y;
        return Math.sqrt(a * a + b * b) < 20;
    }


}









// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = null;
var collectables = [];
var allEnemies = [];

function init() {
    player = new Player();

    collectables.push(new Collectable({ x: 200, y: 300, player: player }));
    collectables.push(new Collectable({ x: 300, y: 200, player: player }));
    collectables.push(new Collectable({ x: 100, y: 100, player: player }));
    collectables.push(new Collectable({ x: 100, y: 50, player: player }));
    collectables.push(new Collectable({ x: 400, y: 50, player: player }));

    fillEnemies();
}

function fillEnemies() {
    allEnemies.push(new Enemy({ x: -100, y: 50, speed: 300, player: player }));
    allEnemies.push(new Enemy({ x: -200, y: 100, speed: 200, player: player }));
    allEnemies.push(new Enemy({ x: 0, y: 150, speed: 100, player: player }));
    allEnemies.push(new Enemy({ x: 0, y: 200, speed: 200, player: player }));
    allEnemies.push(new Enemy({ x: -100, y: 250, speed: 100, player: player }));
    allEnemies.push(new Enemy({ x: -200, y: 300, speed: 200, player: player }));
}


init();

setInterval(() => {
    if (player.isGameWon) {
        init();
    }
}, 1000);

setInterval(() => {
    allEnemies.filter((enemy)=>enemy.x>600).forEach(enemyGuy=>enemyGuy.x  =  enemyGuy.initialXposition );
}, 1000);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
