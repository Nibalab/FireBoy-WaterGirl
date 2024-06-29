var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  var game = new Phaser.Game(config);
  var player;
  var cursors;
  var platforms;
  
  function preload() {
    // Load the character and block images
    this.load.image('character', 'assets/character.png');
    this.load.image('block', 'assets/block.png');
  }
  
  function create() {
    // Create the platforms group with physics
    platforms = this.physics.add.staticGroup();
    
    // Create the ground
    platforms.create(400, 568, 'block').setScale(2).refreshBody();
  
    // Create some additional platforms
    platforms.create(600, 400, 'block');
    platforms.create(50, 250, 'block');
    platforms.create(750, 220, 'block');
  
    // Create the player sprite
    player = this.physics.add.sprite(100, 450, 'character');
  
    // Set player physics properties
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
  
    // Add player collision with platforms
    this.physics.add.collider(player, platforms);
  
    // Set up cursor keys for movement
    cursors = this.input.keyboard.createCursorKeys();
  }
  
  function update() {
    // Reset player velocity
    player.setVelocityX(0);
  
    // Move left
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
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
  