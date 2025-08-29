import Phaser from 'phaser';
import { Game } from '@illara-camp/shared';

class FlappyScene extends Phaser.Scene {
  private bird!: Phaser.GameObjects.Graphics;
  private pipes!: Phaser.Physics.Arcade.Group;
  private scoreText!: Phaser.GameObjects.Text;
  private score: number = 0;
  private gameOver: boolean = false;
  private onResult!: (score: number) => void;

  constructor() {
    super({ key: 'FlappyScene' });
  }

  init(data: { onResult: (score: number) => void }) {
    this.onResult = data.onResult;
  }

  create() {
    // Set up physics
    this.physics.world.gravity.y = 800;

    // Create bird (simple circle)
    this.bird = this.add.graphics();
    this.bird.fillStyle(0xff6b6b, 1);
    this.bird.fillCircle(0, 0, 15);
    this.bird.x = 100;
    this.bird.y = 300;
    
    this.physics.add.existing(this.bird);
    const birdBody = this.bird.body as Phaser.Physics.Arcade.Body;
    birdBody.setCollideWorldBounds(true);
    birdBody.setBounce(0.1);

    // Create pipes group
    this.pipes = this.physics.add.group();

    // Score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4
    });

    // Input handling
    this.input.on('pointerdown', () => {
      if (!this.gameOver) {
        this.flap();
      }
    });

    // Start spawning pipes
    this.time.addEvent({
      delay: 1500,
      callback: this.spawnPipe,
      callbackScope: this,
      loop: true
    });

    // Collision detection
    this.physics.add.collider(this.bird, this.pipes, this.gameOverHandler, undefined, this);
  }

  private flap() {
    if (this.bird.body) {
      (this.bird.body as Phaser.Physics.Arcade.Body).setVelocityY(-400);
    }
  }

  private spawnPipe() {
    if (this.gameOver) return;

    const gap = 150;
    const gapY = Phaser.Math.Between(100, 500);
    
    // Top pipe
    const topPipe = this.add.graphics();
    topPipe.fillStyle(0x4ecdc4, 1);
    topPipe.fillRect(0, 0, 50, gapY);
    topPipe.x = 800;
    topPipe.y = 0;
    this.physics.add.existing(topPipe);
    const topPipeBody = topPipe.body as Phaser.Physics.Arcade.Body;
    topPipeBody.setImmovable(true);
    topPipeBody.setVelocityX(-200); // Move left
    this.pipes.add(topPipe);

    // Bottom pipe
    const bottomPipe = this.add.graphics();
    bottomPipe.fillStyle(0x4ecdc4, 1);
    bottomPipe.fillRect(0, 0, 50, 600 - gapY - gap);
    bottomPipe.x = 800;
    bottomPipe.y = gapY + gap;
    this.physics.add.existing(bottomPipe);
    const bottomPipeBody = bottomPipe.body as Phaser.Physics.Arcade.Body;
    bottomPipeBody.setImmovable(true);
    bottomPipeBody.setVelocityX(-200); // Move left
    this.pipes.add(bottomPipe);

    // Destroy pipes when they go off screen
    this.time.delayedCall(4000, () => {
      if (topPipe.active) topPipe.destroy();
      if (bottomPipe.active) bottomPipe.destroy();
    });

    // Add score trigger
    const scoreTrigger = this.add.graphics();
    scoreTrigger.fillStyle(0xffffff, 0);
    scoreTrigger.fillRect(0, 0, 1, gap);
    scoreTrigger.x = 800;
    scoreTrigger.y = gapY;
    this.physics.add.existing(scoreTrigger);
    const scoreTriggerBody = scoreTrigger.body as Phaser.Physics.Arcade.Body;
    scoreTriggerBody.setImmovable(true);
    scoreTriggerBody.setVelocityX(-200); // Move left with pipes
    
    // Destroy score trigger when it goes off screen
    this.time.delayedCall(4000, () => {
      if (scoreTrigger.active) scoreTrigger.destroy();
    });

    // Check if bird passes the trigger
    this.physics.add.overlap(this.bird, scoreTrigger, () => {
      this.score++;
      this.scoreText.setText(`Score: ${this.score}`);
      scoreTrigger.destroy();
    }, undefined, this);
  }

  private gameOverHandler() {
    if (this.gameOver) return;
    
    this.gameOver = true;
    this.physics.pause();
    
    // Show game over text
    this.add.text(400, 300, 'Game Over!', {
      fontSize: '48px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Call onResult after a delay
    this.time.delayedCall(2000, () => {
      this.onResult(this.score);
    });
  }

  update() {
    if (this.gameOver) return;

    // Rotate bird based on velocity
    if (this.bird.body) {
      const velocity = (this.bird.body as Phaser.Physics.Arcade.Body).velocity.y;
      this.bird.rotation = Phaser.Math.Clamp(velocity / 400, -0.5, 0.5);
    }
  }
}

export const flappyGame: Game = {
  id: 'flappy',
  title: 'Flappy Rocket',
  engine: 'phaser',
  recommendedSessionSec: 60,
  difficulty: 1,
  
  mount(container: HTMLElement, onResult: (score: number) => void) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: container,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: FlappyScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    const game = new Phaser.Game(config);
    
    // Pass onResult to the scene
    game.scene.start('FlappyScene', { onResult });
    
    // Store game instance for cleanup
    (container as any).phaserGame = game;
  },
  
  unmount() {
    const game = (container as any).phaserGame;
    if (game) {
      game.destroy(true);
    }
  }
};
