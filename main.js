let game;

class Example extends Phaser.Scene {
    preload() {
        this.load.setBaseURL('https://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
    }

    create() {
        this.add.image(400, 300, 'sky');

        const particles = this.add.particles(0, 0, 'red', {
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        const logo = this.physics.add.image(400, 100, 'logo');

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        particles.startFollow(logo);
    }
}

function startGame() {
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
                gravity: { y: 200 }
            }
        }
    };

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
