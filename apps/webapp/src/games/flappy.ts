import Phaser from 'phaser';
import { Game } from '@illara-camp/shared';
import { playSfx } from '../audio/engine';

class FlappyScene extends Phaser.Scene {
  private bird!: Phaser.GameObjects.Image;
  private pipes!: Phaser.GameObjects.Group;
  private scoreText!: Phaser.GameObjects.Text;
  private score: number = 0;
  private maxScore: number = 0;
  private gameOver: boolean = false;
  private difficulty: number = 1;
  private pipeSpawnDelay: number = 1500;

  // Helper function to create texture from SVG
  private createTextureFromSVG(key: string, svgString: string): void {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Create Phaser texture from canvas
      this.textures.addCanvas(key, canvas);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
  }

  constructor() {
    super({ key: 'FlappyScene' });
  }

  create() {
    // Set up physics
    this.physics.world.gravity.y = 800;

    // Create beautiful sky background
    const skyGradient = this.add.graphics();
    skyGradient.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x5DADE2, 0x5DADE2, 1);
    skyGradient.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    
    // Add some clouds
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.graphics();
      cloud.fillStyle(0xFFFFFF, 0.8);
      cloud.fillCircle(
        Phaser.Math.Between(100, this.cameras.main.width - 100),
        Phaser.Math.Between(50, 150),
        Phaser.Math.Between(20, 40)
      );
      cloud.fillCircle(
        cloud.x + 30,
        cloud.y - 10,
        Phaser.Math.Between(15, 25)
      );
      cloud.fillCircle(
        cloud.x + 60,
        cloud.y,
        Phaser.Math.Between(20, 35)
      );
    }

    // Create rocket SVG texture
    const rocketSVG = `
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#E74C3C;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FFD166;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FF6B6B;stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- Rocket body -->
        <ellipse cx="24" cy="24" rx="12" ry="16" fill="url(#rocketGrad)" stroke="#C0392B" stroke-width="2"/>
        <!-- Rocket window -->
        <circle cx="24" cy="20" r="4" fill="#87CEEB" stroke="#5DADE2" stroke-width="1"/>
        <!-- Rocket fins -->
        <polygon points="12,32 8,40 16,40" fill="#E74C3C" stroke="#C0392B" stroke-width="1"/>
        <polygon points="36,32 40,40 32,40" fill="#E74C3C" stroke="#C0392B" stroke-width="1"/>
        <!-- Flame -->
        <polygon points="24,40 20,48 24,44 28,48" fill="url(#flameGrad)"/>
      </svg>
    `;
    
    this.createTextureFromSVG('rocket', rocketSVG);

    // Create bird using rocket texture
    this.bird = this.add.image(
      this.cameras.main.width * 0.2,
      this.cameras.main.height * 0.5,
      'rocket'
    );
    this.bird.setScale(1.2); // Make rocket slightly bigger
    
    // Add ground
    const ground = this.add.graphics();
    ground.fillStyle(0x8B4513, 1);
    ground.fillRect(0, this.cameras.main.height - 50, this.cameras.main.width, 50);
    ground.lineStyle(2, 0x654321, 1);
    ground.strokeRect(0, this.cameras.main.height - 50, this.cameras.main.width, 50);
    
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

    // ILL formula text
    // Add ILL info text
    this.add.text(20, 40, 'ILL: 1 per 10 points', {
      fontSize: '16px',
      color: '#8b5cf6',
      stroke: '#000',
      strokeThickness: 1
    });

    // Input handling
    this.input.on('pointerdown', () => {
      if (!this.gameOver) {
        this.flap();
      }
    });

    // Start spawning pipes
    this.time.addEvent({
      delay: this.pipeSpawnDelay,
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
      playSfx('jump'); // Play jump sound
    }
  }

  private updateDifficulty() {
    // Increase difficulty based on score
    if (this.score >= 30) {
      this.difficulty = 3;
      this.pipeSpawnDelay = 800; // Faster pipe spawning
    } else if (this.score >= 20) {
      this.difficulty = 2;
      this.pipeSpawnDelay = 1200; // Medium pipe spawning
    } else if (this.score >= 10) {
      this.difficulty = 1;
      this.pipeSpawnDelay = 1500; // Normal pipe spawning
    } else {
      this.difficulty = 1;
      this.pipeSpawnDelay = 1500; // Normal pipe spawning
    }
    
    // Update difficulty in container for GameHost to access
    (this.game.config.parent as any).currentDifficulty = this.difficulty;
  }

  private spawnPipe() {
    if (this.gameOver) return;

    const gap = 150;
    const gapY = Phaser.Math.Between(100, this.cameras.main.height - 200);
    
    // Top pipe - create with better colors
    const topPipe = this.add.rectangle(this.cameras.main.width + 50, gapY / 2, 60, gapY, 0x2EC4B6);
    topPipe.setStrokeStyle(3, 0x1B4965);
    this.pipes.add(topPipe);

    // Bottom pipe - create with better colors
    const bottomPipe = this.add.rectangle(this.cameras.main.width + 50, gapY + gap + (this.cameras.main.height - gapY - gap) / 2, 60, this.cameras.main.height - gapY - gap, 0x2EC4B6);
    bottomPipe.setStrokeStyle(3, 0x1B4965);
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
          playSfx('point'); // Play point sound
          // Update max score
          if (this.score > this.maxScore) {
            this.maxScore = this.score;
          }
          // Update difficulty based on score
          this.updateDifficulty();
          // Save max score to container for GameHost to access
          (this.game.config.parent as any).currentScore = this.maxScore;
          console.log('Score updated:', this.score, 'Max score:', this.maxScore, 'Difficulty:', this.difficulty);
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
    playSfx('fail'); // Play fail sound
    
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
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    const game = new Phaser.Game(config);
    
    // Start the scene
    game.scene.start('FlappyScene');
    
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
