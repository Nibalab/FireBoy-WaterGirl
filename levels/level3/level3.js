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

class level3 extends Phaser.Scene {
  constructor() {
    super('Level3');
  }

  preload() {
    this.load.image('character', '../../assets/charfire.png'); // Ensure this path is correct
    this.load.image('collectible', '../../assets/fireCollectible.png'); // Load the collectible image
    this.load.image('player2Collectible', '../../assets/waterCollectible.png'); // Load the player2 collectible image
    this.load.image('character2', '../../assets/blue_girl_character.png'); // Ensure this path is correct
  }

  create() {
    this.createBrickWall();
    this.createRoads();

    // First Character
    player = this.physics.add.sprite(40, 550, 'character');
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
    player1ScoreText = this.add.text(250, 0, 'Player1 Score: 0', { fontSize: '25px', fill: '#000', fontStyle: 'bold' });
    player2ScoreText = this.add.text(550, 0, 'Player2 Score: 0', { fontSize: '25px', fill: '#000', fontStyle: 'bold' });

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
    this.physics.add.overlap(player, losingAreaPlayer1, this.handleLosePlayer1, null, this);
    this.physics.add.overlap(player2, losingAreaPlayer2, this.handleLosePlayer2, null, this);
  }
  createRoads() {
    platforms = this.physics.add.staticGroup(); // Create a static group for the platforms

    // Define the road/platform positions and sizes
    const platformData = [
      { x: 0, y: 580, width: 750, height: 20 }, // ground start
      { x: 410, y: 580, width: 550, height: 20 }, // after the red ground
      { x: 700, y: 542, width: 100, height: 40 }, // the block on the right
      { x: 200, y: 510, width: 380, height: 10 }, //  1 
      { x: 0, y: 430, width: 300, height: 20 }, // 2-1 
      { x: 500, y: 430, width: 500, height: 20 }, //  2-2 
      { x: 0, y: 340, width: 50, height: 20 }, // 3-1 
      { x: 750, y: 340, width: 50, height: 10 }, //3-2
      { x: 100, y: 300, width: 200, height: 23 }, //  4-1 
      { x: 400, y: 300, width: 300, height: 23 }, // 4-2
      { x: 0, y: 230, width: 80, height: 10 }, //5-1 
      { x: 160, y: 200, width: 50, height: 10 }, //5-2
      { x: 200, y: 120, width: 700, height: 30 }, // 6
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
    graphicsmale.fillRect(750, 60, 40, 60); // Male exit
    graphicsfemale.fillRect(660, 60, 40, 60); // Female exit

    // Add symbols to the doors
    this.add.text(763, 60, '♂', { fontSize: '28px', fill: '#FFFFFF' });
    this.add.text(675, 60, '♀', { fontSize: '28px', fill: '#FFFFFF' });
  }

  

}