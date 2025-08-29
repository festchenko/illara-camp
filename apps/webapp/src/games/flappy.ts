import Phaser from 'phaser';
import { Game } from '@illara-camp/shared';

class FlappyScene extends Phaser.Scene {
  private bird!: Phaser.GameObjects.Graphics;
  private pipes!: Phaser.GameObjects.Group;
  private scoreText!: Phaser.GameObjects.Text;
  private score: number = 0;
  private maxScore: number = 0;
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
    this.bird.fillCircle(0, 0, 20); // Увеличили размер
    this.bird.lineStyle(3, 0xff0000, 1); // Добавили обводку
    this.bird.strokeCircle(0, 0, 20);
    this.bird.x = this.cameras.main.width * 0.2; // 20% от ширины экрана
    this.bird.y = this.cameras.main.height * 0.5; // центр экрана
    
    this.physics.add.existing(this.bird);
    const birdBody = this.bird.body as Phaser.Physics.Arcade.Body;
    birdBody.setCollideWorldBounds(true);
    birdBody.setBounce(0.1);

    // Create pipes group
    this.pipes = this.add.group();

    // Score text
    this.scoreText = this.add.text(20, 10, 'Score: 0', {
      fontSize: '24px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 2
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
    const gapY = Phaser.Math.Between(100, this.cameras.main.height - 200);
    
    // Top pipe - create as simple rectangle without physics
    const topPipe = this.add.rectangle(this.cameras.main.width + 50, gapY / 2, 50, gapY, 0x4ecdc4);
    this.pipes.add(topPipe);

    // Bottom pipe - create as simple rectangle without physics
    const bottomPipe = this.add.rectangle(this.cameras.main.width + 50, gapY + gap + (this.cameras.main.height - gapY - gap) / 2, 50, this.cameras.main.height - gapY - gap, 0x4ecdc4);
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
    scoreTrigger.x = this.cameras.main.width + 50;
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
        if (scoreTrigger.active && this.bird.x > scoreTrigger.x && !scored && !this.gameOver) {
          this.score++;
          this.scoreText.setText(`Score: ${this.score}`);
          // Update max score
          if (this.score > this.maxScore) {
            this.maxScore = this.score;
          }
          // Save max score to container for GameHost to access
          (this.game.config.parent as any).currentScore = this.maxScore;
          console.log('Score updated:', this.score, 'Max score:', this.maxScore);
          scored = true;
        }
      },
      loop: true
    });
  }

  private checkCollisions() {
    if (this.gameOver) return;

    const birdX = this.bird.x;
    const birdY = this.bird.y;
    const birdRadius = 20; // Обновили радиус под новый размер
    
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
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.3, 'Game Over!', {
      fontSize: '36px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Show final score
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.4, `Final Score: ${this.maxScore}`, {
      fontSize: '24px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Update container with max score
    (this.game.config.parent as any).currentScore = this.maxScore;

    // Add restart button
    const restartButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.5, 'Play Again', {
      fontSize: '20px',
      color: '#fff',
      backgroundColor: '#8b5cf6',
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setInteractive();

    restartButton.on('pointerdown', () => {
      this.restartGame();
    });

    // Don't call onResult here - let the player decide when to finish
    // onResult will be called when they exit the game
  }

  private restartGame() {
    // Reset game state
    this.gameOver = false;
    this.score = 0;
    
    // Clear all pipes
    this.pipes.clear(true, true);
    
    // Clear all game over UI elements by type
    this.children.each((child: any) => {
      if (child.type === 'Text' && 
          (child.text === 'Game Over!' || 
           child.text.includes('Final Score:') || 
           child.text === 'Play Again')) {
        child.destroy();
      }
    });
    
    // Reset bird position
    this.bird.x = this.cameras.main.width * 0.2;
    this.bird.y = this.cameras.main.height * 0.5;
    const birdBody = this.bird.body as Phaser.Physics.Arcade.Body;
    birdBody.setVelocity(0, 0);
    
    // Resume physics
    this.physics.resume();
    
    // Update score text
    this.scoreText.setText('Score: 0');
    
    // Make bird visible again
    this.bird.setVisible(true);
    
    // Force clear all remaining game over UI elements
    this.children.each((child: any) => {
      if (child.type === 'Text' && 
          (child.text === 'Game Over!' || 
           child.text.includes('Final Score:') || 
           child.text === 'Play Again')) {
        child.destroy();
      }
    });
    
    // Additional cleanup - remove all text objects except score text
    this.children.each((child: any) => {
      if (child.type === 'Text' && child !== this.scoreText) {
        child.destroy();
      }
    });
    
    // Keep max score in container for GameHost to access
    (this.game.config.parent as any).currentScore = this.maxScore;
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
    // Get the actual container dimensions
    const containerWidth = container.clientWidth || window.innerWidth;
    const containerHeight = container.clientHeight || window.innerHeight;
    
    console.log('Container dimensions:', containerWidth, 'x', containerHeight);
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: containerWidth,
      height: containerHeight,
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
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: containerWidth,
        height: containerHeight
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
