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
}