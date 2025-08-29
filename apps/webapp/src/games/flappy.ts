import Phaser from 'phaser';
import { Game } from '@illara-camp/shared';

class FlappyScene extends Phaser.Scene {
  private bird!: Phaser.GameObjects.Graphics;
  private pipes!: Phaser.GameObjects.Group;
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
    this.pipes = this.add.group();

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

    // Collision detection - check manually since pipes don't have physics
    this.time.addEvent({
      delay: 16, // 60 FPS
      callback: this.checkCollisions,
      callbackScope: this,
      loop: true
    });
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
    
    // Top pipe - create as simple rectangle without physics
    const topPipe = this.add.rectangle(800, gapY / 2, 50, gapY, 0x4ecdc4);
    this.pipes.add(topPipe);

    // Bottom pipe - create as simple rectangle without physics
    const bottomPipe = this.add.rectangle(800, gapY + gap + (600 - gapY - gap) / 2, 50, 600 - gapY - gap, 0x4ecdc4);
    this.pipes.add(bottomPipe);

    // Move pipes with tween
    this.tweens.add({
      targets: [topPipe, bottomPipe],
      x: -100,
      duration: 4000,
      ease: 'Linear',
      onComplete: () => {
        topPipe.destroy();
        bottomPipe.destroy();
      }
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
    
    // Move score trigger with tween
    this.tweens.add({
      targets: scoreTrigger,
      x: -100,
      duration: 4000,
      ease: 'Linear',
      onComplete: () => {
        scoreTrigger.destroy();
      }
    });

    // Check if bird passes the trigger - manual check
    let scored = false;
    this.time.addEvent({
      delay: 16,
      callback: () => {
        if (scoreTrigger.active && this.bird.x > scoreTrigger.x && !scored) {
          this.score++;
          this.scoreText.setText(`Score: ${this.score}`);
          scored = true;
          scoreTrigger.destroy();
        }
      },
      loop: true
    });
  }

  private checkCollisions() {
    if (this.gameOver) return;

    const birdX = this.bird.x;
    const birdY = this.bird.y;
    const birdRadius = 15;
    
    this.pipes.getChildren().forEach((pipe: any) => {
      if (pipe.active) {
        const pipeX = pipe.x;
        const pipeY = pipe.y;
        const pipeWidth = pipe.width || 50;
        const pipeHeight = pipe.height || 50;
        
        // Check collision between bird circle and pipe rectangle
        const closestX = Math.max(pipeX - pipeWidth/2, Math.min(birdX, pipeX + pipeWidth/2));
        const closestY = Math.max(pipeY - pipeHeight/2, Math.min(birdY, pipeY + pipeHeight/2));
        
        const distanceX = birdX - closestX;
        const distanceY = birdY - closestY;
        
        if ((distanceX * distanceX + distanceY * distanceY) < (birdRadius * birdRadius)) {
          this.gameOverHandler();
        }
      }
    });
  }

  private gameOverHandler() {
    if (this.gameOver) return;
    
    this.gameOver = true;
    this.physics.pause();
    
    // Show game over text
    this.add.text(400, 250, 'Game Over!', {
      fontSize: '48px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Show final score
    this.add.text(400, 320, `Final Score: ${this.score}`, {
      fontSize: '32px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Add restart button
    const restartButton = this.add.text(400, 400, 'Play Again', {
      fontSize: '24px',
      color: '#fff',
      backgroundColor: '#8b5cf6',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    restartButton.on('pointerdown', () => {
      this.restartGame();
    });

    // Call onResult after a delay
    this.time.delayedCall(2000, () => {
      this.onResult(this.score);
    });
  }

  private restartGame() {
    // Reset game state
    this.gameOver = false;
    this.score = 0;
    this.scoreText.setText('Score: 0');
    
    // Clear all pipes
    this.pipes.clear(true, true);
    
    // Reset bird position
    this.bird.x = 100;
    this.bird.y = 300;
    const birdBody = this.bird.body as Phaser.Physics.Arcade.Body;
    birdBody.setVelocity(0, 0);
    
    // Resume physics
    this.physics.resume();
    
    // Clear all text objects
    this.children.removeAll(true);
    
    // Recreate score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4
    });
    
    // Recreate bird
    this.bird = this.add.graphics();
    this.bird.fillStyle(0xff6b6b, 1);
    this.bird.fillCircle(0, 0, 15);
    this.bird.x = 100;
    this.bird.y = 300;
    
    this.physics.add.existing(this.bird);
    const newBirdBody = this.bird.body as Phaser.Physics.Arcade.Body;
    newBirdBody.setCollideWorldBounds(true);
    newBirdBody.setBounce(0.1);
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
          gravity: { x: 0, y: 0 },
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
  
  unmount(container: HTMLElement) {
    const game = (container as any).phaserGame;
    if (game) {
      game.destroy(true);
    }
  }
};
