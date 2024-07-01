// import Phaser from 'phaser';

let player;
let platforms;
let cursors;
let losingArea;

class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  preload() {
    let drawing1 = localStorage.getItem('character1');
    let drawing2 = localStorage.getItem('character2');

    if (drawing1) {
        this.load.image('character1', drawing1);
    }
    if (drawing2) {
        this.load.image('character2', drawing2);
    }
    // this.load.image('character', '../../assets/charfire.png'); // Ensure this path is correct
  }

  create() {
    this.createBrickWall();
    this.createRoads();

    player = this.physics.add.sprite(40, 550, 'character1');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Add player collision with platforms
    this.physics.add.collider(player, platforms);

    // Create cursor keys input
    cursors = this.input.keyboard.createCursorKeys();

    // Create the losing area
    this.createLosingArea();
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

    // Check for collision with the losing area
    this.physics.add.overlap(player, losingArea, this.handleLose, null, this);
  }

  createRoads() {
    platforms = this.physics.add.staticGroup(); // Create a static group for the platforms

    // Define the road/platform positions and sizes
    const platformData = [
      { x: 0, y: 580, width: 320, height: 20 },
      { x: 410, y: 580, width: 550, height: 20 },
      { x: 700, y: 542, width: 100, height: 40 },
      { x: 0, y: 500, width: 180, height: 10 },
      { x: 0, y: 410, width: 300, height: 20 },
      { x: 290, y: 430, width: 100, height: 10 },
      { x: 380, y: 410, width: 70, height: 20 },
      { x: 490, y: 460, width: 80, height: 20 },
      { x: 440, y: 430, width: 80, height: 30 },
      { x: 550, y: 480, width: 80, height: 20 },
      { x: 0, y: 340, width: 50, height: 20 },
      { x: 100, y: 300, width: 850, height: 30 },
      { x: 750, y: 240, width: 50, height: 20 },
      { x: 0, y: 200, width: 700, height: 30 },
      { x: 0, y: 140, width: 50, height: 20 },
      { x: 100, y: 100, width: 700, height: 30 },
    ];

    // Create the road/platforms
    platformData.forEach((platform) => {
      let plat = this.add.rectangle(
        platform.x + platform.width / 2,
        platform.y + platform.height / 2,
        platform.width,
        platform.height,
        0xa9a9a9
      );
      this.physics.add.existing(plat, true); // Add physics to the platform
      platforms.add(plat);
    });

    // Draw the exit doors
    const graphicsmale = this.add.graphics();
    const graphicsfemale = this.add.graphics();
    graphicsfemale.fillStyle(0x1219e3, 1);
    graphicsmale.fillStyle(0xe31d12, 1); // Dim gray color for the doors
    graphicsmale.fillRect(630, 40, 40, 60); // Male exit
    graphicsfemale.fillRect(700, 40, 40, 60); // Female exit

    // Add symbols to the doors
    this.add.text(640, 60, '♂', { fontSize: '28px', fill: '#FFFFFF' });
    this.add.text(710, 60, '♀', { fontSize: '28px', fill: '#FFFFFF' });
  }

  createLosingArea() {
    // Create a losing area (e.g., a red zone at the bottom of the screen)
    losingArea = this.add.rectangle(365, 595, 90, 15, 0xff0000);
    this.physics.add.existing(losingArea, true); // Add physics to the losing area
  }

  handleLose(player, losingArea) {
    // Handle what happens when the player loses
    backToLevels();
  }

  createBrickWall() {
    const brickWidth = 50;
    const brickHeight = 25;
    const wallWidth = this.scale.width;
    const wallHeight = this.scale.height;

    const graphics = this.add.graphics();
    graphics.fillStyle(0xffd089, 1); // Brown color for the bricks

    for (let y = 0; y < wallHeight; y += brickHeight) {
      for (let x = 0; x < wallWidth; x += brickWidth) {
        graphics.fillRect(x, y, brickWidth - 2, brickHeight - 2); // Slight gap for a more realistic look
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scene: Level1,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }, // Increase gravity for better jumping feel
    },
  },
};

const game = new Phaser.Game(config);

function backToLevels() {
  console.log('trying to log out');
  window.location.href = '/levels/maps/maps.html';
  if (game) {
    game.destroy(true);
  }
}

// export default Level1;
