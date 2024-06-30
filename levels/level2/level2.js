let player;
let player2;
let platforms;
let cursors;
let losingArea;
let collectibles;
let score = 0;
let scoreText;

class Level2 extends Phaser.Scene {
  constructor() {
    super('Level2');
  }

  preload() {
    this.load.image('character', '../../assets/charfire.png'); // Ensure this path is correct
    this.load.image('collectible', '../../assets/fireCollectible.png'); // Load the collectible image
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

    // Create the losing area
    this.createLosingArea();

    // Create collectibles
    this.createCollectibles();

    // Add score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // Set up overlap between player and collectibles
    this.physics.add.overlap(player, collectibles, this.collectCollectible, null, this);
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
      { x: 0, y: 580, width: 320, height: 20 }, // ground start
      { x: 410, y: 580, width: 550, height: 20 }, // after the red ground
      { x: 700, y: 542, width: 100, height: 40 }, // the block on the right
      { x: 730, y: 490, width: 70, height: 100 },
      { x: 250, y: 510, width: 180, height: 10 }, // girl start point
      { x: 0, y: 410, width: 300, height: 20 }, // above the girl
      //   { x: 290, y: 430, width: 100, height: 10 }, // the pit the kills both
      { x: 380, y: 410, width: 300, height: 20 }, // beside the pit
      //   { x: 490, y: 460, width: 80, height: 20 }, // second step of the stairs
      //   { x: 440, y: 430, width: 80, height: 30 }, // 3rd step
      //   { x: 550, y: 480, width: 80, height: 20 }, // 1st step
      { x: 0, y: 340, width: 50, height: 20 }, // the first block on the left to jump
      { x: 100, y: 300, width: 850, height: 23 }, // second floor
      { x: 750, y: 310, width: 40, height: 10 },
      { x: 750, y: 170, width: 50, height: 20 }, // the block on the right to jump
      { x: 150, y: 220, width: 200, height: 20 }, // 3rd floor
      { x: 450, y: 220, width: 200, height: 20 }, // 3rd floor
      //   { x: 0, y: 140, width: 50, height: 20 }, // the second block on the left side
      { x: 0, y: 100, width: 700, height: 30 }, // last floor
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
    graphicsmale.fillRect(10, 40, 40, 60); // Male exit
    graphicsfemale.fillRect(100, 40, 40, 60); // Female exit

    // Add symbols to the doors
    this.add.text(23, 60, '♂', { fontSize: '28px', fill: '#FFFFFF' });
    this.add.text(110, 60, '♀', { fontSize: '28px', fill: '#FFFFFF' });
  }

  createLosingArea() {
    // Create a losing area (e.g., a red zone at the bottom of the screen)
    losingArea = this.add.rectangle(365, 595, 90, 15, 0xff0000);
    this.physics.add.existing(losingArea, true); // Add physics to the losing area
  }

  handleLose(player, losingArea) {
    // Handle what happens when the player loses
    backToMenu();
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

  createCollectibles() {
    collectibles = this.physics.add.staticGroup(); // Create a static group for collectibles

    // Define the positions for the collectibles
    const collectibleData = [
      { x: 200, y: 550 },
      { x: 300, y: 200 },
      { x: 550, y: 400 },
      { x: 400, y: 80 },
      
    ];

    // Create collectibles at the specified positions
    collectibleData.forEach((data) => {
      let collectible = collectibles.create(data.x, data.y, 'collectible');
      collectible.setScale(0.5); // Adjust scale if necessary
    });
  }

  collectCollectible(player, collectible) {
    collectible.disableBody(true, true);

    // Add to score
    score += 1;
    scoreText.setText('Score: ' + score);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scene: Level2,
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

// export default Level2;
