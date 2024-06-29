let game;
let player;
let platforms;
let cursors;

class Example extends Phaser.Scene {
    preload() {
        this.load.image('character', 'assets/charfire.png'); // Use the resized image
    }

    create() {
        this.createBrickWall();
        this.createRoads();

        player = this.physics.add.sprite(40, 550, 'character');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        // Add player collision with platforms
        this.physics.add.collider(player, platforms);

        // Create cursor keys input
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (cursors.left.isDown) {
            player.setVelocityX(-160); // Move left
        } else if (cursors.right.isDown) {
            player.setVelocityX(160); // Move right
        } else {
            player.setVelocityX(0); // Stop
        }

        // Allow the player to jump if they are touching the ground
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-230); // Jump
        }
    }

    createRoads() {
        platforms = this.physics.add.staticGroup(); // Create a static group for the platforms

        // Define the road/platform positions and sizes
        const platformData = [
            { x: 0, y: 580, width: 900, height: 20 },
            { x: 700, y: 542, width: 100, height: 40 },
            { x: 0, y: 500, width: 180, height: 20 },
            { x: 0, y: 400, width: 500, height: 30 },
            { x: 470, y: 440, width: 100, height: 30 },
          { x: 540, y: 480, width: 100, height: 30 },
          { x: 0, y: 340, width: 50, height: 20 },

          { x: 100, y: 300, width: 850, height: 30 },
          { x: 750, y: 240, width: 50, height: 20 },

          { x: 0, y: 200, width: 700, height: 30 },
          { x: 0, y: 140, width: 50, height: 20 },

            { x: 100, y: 100, width: 700, height: 30 },
        ];

        // Create the road/platforms
        platformData.forEach(platform => {
            let plat = this.add.rectangle(platform.x + platform.width / 2, platform.y + platform.height / 2, platform.width, platform.height, 0xA9A9A9);
            this.physics.add.existing(plat, true); // Add physics to the platform
            platforms.add(plat);
        });

        // Draw the exit doors
        const graphics = this.add.graphics();
        graphics.fillStyle(0x696969, 1); // Dim gray color for the doors
        graphics.fillRect(650, 50, 30, 50); // Male exit
        graphics.fillRect(700, 50, 30, 50); // Female exit

        // Add symbols to the doors
        this.add.text(660, 60, '♂', { fontSize: '20px', fill: '#FFFFFF' });
        this.add.text(710, 60, '♀', { fontSize: '20px', fill: '#FFFFFF' });
    }

    createBrickWall() {
        const brickWidth = 50;
        const brickHeight = 25;
        const wallWidth = this.scale.width;
        const wallHeight = this.scale.height;

        const graphics = this.add.graphics();
        graphics.fillStyle(0xFFD089, 1); // Brown color for the bricks

        for (let y = 0; y < wallHeight; y += brickHeight) {
            for (let x = 0; x < wallWidth; x += brickWidth) {
                graphics.fillRect(x, y, brickWidth - 2, brickHeight - 2); // Slight gap for a more realistic look
            }
        }
    }
}

function startGame() { }
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('instructions-page').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        scene: Example,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 } // Increase gravity for better jumping feel
            }
        }
    };

    game = new Phaser.Game(config);


function showInstructions() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('instructions-page').style.display = 'flex';
}

function backToMenu() {
    document.getElementById('landing-page').style.display = 'flex';
    document.getElementById('instructions-page').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    if (game) {
        game.destroy(true);
    }
    // Move right
    else if (cursors.right.isDown) {
      player.setVelocityX(160);
    }

    // Jump
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
  }
