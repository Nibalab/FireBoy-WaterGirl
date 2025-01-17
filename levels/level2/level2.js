let player;
let player2;
let platforms;
let cursors;
let wad;
let losingArea;
let losingAreaPlayer1;
let losingAreaPlayer2;
let collectibles;
let player2Collectibles;
let score = 0;
let scoreText;
let player2Score = 0;
let player2ScoreText;
let player1ScoreText;
let player1Score = 0;
let player1DoorZone;
let player2DoorZone;
let player1ReachedDoor = false;
let player2ReachedDoor = false;

class Level2 extends Phaser.Scene {
  constructor() {
    super('Level2');
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
    this.load.image('collectible', '../../assets/fireCollectible.png');
    this.load.image('player2Collectible', '../../assets/waterCollectible.png');
  }


  create() {
    this.createBrickWall();
    this.createRoads();

    // First Character
    player = this.physics.add.sprite(40, 550, 'character1');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Second Character
    player2 = this.physics.add.sprite(100, 550, 'character2');
    player2.setBounce(0.2);
    player2.setCollideWorldBounds(true);


    // Add player collision with platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player2, platforms);

    // Create cursor keys input
    cursors = this.input.keyboard.createCursorKeys();

    // Create W, A, D keys input
    wad = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Create the losing area
    this.createLosingAreas();

    // Create collectibles
    this.createCollectibles();

    // Create player2 specific collectibles
    this.createPlayer2Collectibles();

    // Add score text
    scoreText = this.add.text(0, 0, 'Score: 0', { fontSize: '25px', fill: '#000', fontStyle: 'bold' });
    player1ScoreText = this.add.text(230, 0, 'BlazeBoy Score: 0', { fontSize: '25px', fill: '#E31D12', fontStyle: 'bold' });
    player2ScoreText = this.add.text(520, 0, 'WaterGirl Score: 0', { fontSize: '25px', fill: '#1219E3', fontStyle: 'bold' });

    // Set up overlap between players and collectibles
    this.physics.add.overlap(player, collectibles, this.collectCollectible, null, this);
    this.physics.add.overlap(player2, player2Collectibles, this.collectPlayer2Collectible, null, this);

    // Create door zones
    this.createDoorZones();

    // Set up overlap between players and door zones
    this.physics.add.overlap(player, player1DoorZone, this.reachDoor1, null, this);
    this.physics.add.overlap(player2, player2DoorZone, this.reachDoor2, null, this);

  }

  update() {
    if (!player1ReachedDoor) {
      // Control for the first player
      if (cursors.left.isDown) {
        player.setVelocityX(-160); // Move left
      } else if (cursors.right.isDown) {
        player.setVelocityX(160); // Move right
      } else {
        player.setVelocityX(0); // Stop
      }

      if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-230); // Jump
      }
    } else {
      player.setVelocityX(0); // Stop
    }

    if (!player2ReachedDoor) {
      // Control for the second player
      if (wad.left.isDown) {
        player2.setVelocityX(-160); // Move left
      } else if (wad.right.isDown) {
        player2.setVelocityX(160); // Move right
      } else {
        player2.setVelocityX(0); // Stop
      }

      if (wad.up.isDown && player2.body.touching.down) {
        player2.setVelocityY(-230); // Jump
      }
    } else {
      player2.setVelocityX(0); // Stop
    }

    // Check for collision with the losing areas
    this.physics.add.overlap(player, losingArea, this.handleLose, null, this);
    this.physics.add.overlap(player2, losingArea, this.handleLose, null, this);
    this.physics.add.overlap(player, losingAreaPlayer1, this.handleLose, null, this);
    this.physics.add.overlap(player2, losingAreaPlayer2, this.handleLose, null, this);
  }

  createRoads() {
    platforms = this.physics.add.staticGroup(); // Create a static group for the platforms

    // Define the road/platform positions and sizes
    const platformData = [
      { x: 0, y: 580, width: 320, height: 20 }, // ground start
      { x: 0, y: 580, width: 320, height: 20 },
      { x: 410, y: 580, width: 550, height: 20 }, // after the red ground
      { x: 700, y: 542, width: 100, height: 40 }, // the block on the right
      { x: 730, y: 490, width: 70, height: 100 },
      { x: 250, y: 510, width: 180, height: 10 }, // girl start point
      { x: 0, y: 410, width: 300, height: 20 }, // above the girl
      { x: 380, y: 410, width: 300, height: 20 }, // beside the pit
      { x: 0, y: 340, width: 50, height: 20 }, // the first block on the left to jump
      { x: 100, y: 300, width: 850, height: 23 }, // second floor
      { x: 750, y: 310, width: 40, height: 10 },
      { x: 750, y: 180, width: 50, height: 10 }, // the block on the right to jump
      { x: 680, y: 250, width: 50, height: 10 },
      { x: 150, y: 220, width: 200, height: 20 }, // 3rd floor
      { x: 450, y: 220, width: 200, height: 20 }, // 3rd floor
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
    graphicsmale.fillStyle(0xe31d12, 1);
    graphicsmale.fillRect(10, 40, 40, 60); // Male exit
    graphicsfemale.fillRect(100, 40, 40, 60); // Female exit

    // Add symbols to the doors
    this.add.text(23, 60, '♂', { fontSize: '28px', fill: '#FFFFFF' });
    this.add.text(110, 60, '♀', { fontSize: '28px', fill: '#FFFFFF' });
  }

  createLosingAreas() {
    // Create a general losing area
    losingArea = this.add.rectangle(365, 595, 90, 15, 0x000000);
    this.physics.add.existing(losingArea, true); // Add physics to the losing area

    // Create losing area for player1
    losingAreaPlayer1 = this.add.rectangle(200, 280, 5, 80, 0x0000FF); // Position and size accordingly
    this.physics.add.existing(losingAreaPlayer1, true);

    // Create losing area for player2
    losingAreaPlayer2 = this.add.rectangle(200, 180, 5, 100, 0xff0000); // Position and size accordingly
    this.physics.add.existing(losingAreaPlayer2, true);
  }

  handleLose(player, losingArea) {
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
        graphics.fillRect(x, y, brickWidth - 2, brickHeight - 2); // Adding a small gap between bricks
      }
    }
  }

  createCollectibles() {
    collectibles = this.physics.add.staticGroup(); // Create a static group for collectibles

    // Define the positions for the collectibles
    const collectibleData = [
      { x: 200, y: 550 },
      { x: 300, y: 200 },
      { x: 550, y: 390 },
      { x: 400, y: 80 },
    ];

    // Create collectibles at the specified positions
    collectibleData.forEach((data) => {
      let collectible = collectibles.create(data.x, data.y, 'collectible');
      collectible.setScale(0.5); // Adjust scale if necessary
    });
  }

  createPlayer2Collectibles() {
    player2Collectibles = this.physics.add.staticGroup(); // Create a static group for player2 collectibles

    // Define the positions for the player2 collectibles
    const player2CollectibleData = [
      { x: 400, y: 500 },
      { x: 150, y: 390 },
      { x: 560, y: 80 },
      { x: 500, y: 200 },
    ];

    // Create player2 collectibles at the specified positions
    player2CollectibleData.forEach((data) => {
      let player2Collectible = player2Collectibles.create(data.x, data.y, 'player2Collectible');
      player2Collectible.setScale(0.5);
    });
  }

  createDoorZones() {
    // Create zones for player1 and player2 doors
    player1DoorZone = this.add.zone(30, 70).setSize(40, 60);
    player2DoorZone = this.add.zone(120, 70).setSize(40, 60);

    this.physics.world.enable(player1DoorZone);
    this.physics.world.enable(player2DoorZone);

    player1DoorZone.body.setAllowGravity(false);
    player2DoorZone.body.setAllowGravity(false);
  }

  reachDoor1(player, doorZone) {
    player1ReachedDoor = true;
    player.setVelocity(0); // Stop player
    player.setTint(0x00ff00);
    this.checkWinCondition();
  }

  reachDoor2(player2, doorZone) {
    player2ReachedDoor = true;
    player2.setVelocity(0); // Stop player2
    player2.setTint(0x00ff00);
    this.checkWinCondition();
  }

  checkWinCondition() {
    if (player1ReachedDoor && player2ReachedDoor) {
      this.winGame();
    }
  }

  winGame() {
    this.add.text(250, 250, 'You Win!', { fontSize: '64px', fill: '#1219E3', fontStyle: 'bold' });

    // Display a link to the next level
    const nextLevelText = this.add.text(150, 320, 'Continue to the: Next Level', {
      fontSize: '32px',
      fill: '#E31D12',
      fontStyle: 'bold'
    });
    nextLevelText.setInteractive({ useHandCursor: true });
    nextLevelText.on('pointerdown', () => {
      window.location.href = '/levels/level3/level3.html';
    });

  }

  collectCollectible(player, collectible) {
    collectible.disableBody(true, true);

    // Add to score
    score += 1;
    player1Score += 1;
    player1ScoreText.setText('BlazeBoy Score: ' + player1Score);
    scoreText.setText('Score: ' + score);
  }

  collectPlayer2Collectible(player2, player2Collectible) {
    player2Collectible.disableBody(true, true);

    // Add to player2 score
    score += 1;
    player2Score += 1;
    player2ScoreText.setText('WaterGirl Score: ' + player2Score);
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
      gravity: { y: 300 },
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
