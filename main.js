let game;

class Example extends Phaser.Scene {
  preload() {

    }

    create() {
      this.createBrickWall();

      this.createRoads();

    }

    createRoads() {
      const graphics = this.add.graphics();
      graphics.fillStyle(0xA9A9A9, 1); // Dark gray color for the road/platforms

      // Define the road/platform positions and sizes
      const platforms = [
          { x: 0, y: 580, width: 900, height: 20 },
          { x: 700, y: 542, width: 100, height: 40 },
          { x: 0, y: 500, width: 180, height: 20 },
          { x: 0, y: 400, width: 500, height: 40 },
          { x: 470, y: 440, width: 100, height: 40 },
          { x: 540, y: 480, width: 100, height: 40 },
          { x: 100, y: 300, width: 850, height: 40 },
          { x: 0, y: 200, width: 700, height: 40 },
          { x: 100, y: 100, width: 700, height: 50 },
      ];

      // Draw the road/platforms
      platforms.forEach(platform => {
          graphics.fillRect(platform.x, platform.y, platform.width, platform.height);
      });

      // Draw the exit doors
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

function startGame() {

document.getElementById('landing-page').style.display = 'none';
    document.getElementById('instructions-page').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    //set the config of the game
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        scene: Example,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        }
    };
    // creating a new game, pass the config
    game = new Phaser.Game(config);
  }

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
}

function backToMenuFromGame() {
    backToMenu();
    game.destroy(true);
}
