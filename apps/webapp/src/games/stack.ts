import * as THREE from 'three';
import { Game } from '@illara-camp/shared';
import { playSfx } from '../audio/engine';

interface StackBlock {
  mesh: THREE.Mesh;
  width: number;
  height: number;
  depth: number;
  position: THREE.Vector3;
}

class StackGame {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  private onResult: (score: number) => void;
  
  private blocks: StackBlock[] = [];
  private currentBlock: StackBlock | null = null;
  private nextBlock: StackBlock | null = null;
  private score: number = 0;
  private gameOver: boolean = false;
  private movingDirection: 'x' | 'z' = 'x';
  private movingSpeed: number = 0.02;
  private movingDistance: number = 0;
  private maxDistance: number = 2;

  constructor(container: HTMLElement, onResult: (score: number) => void) {
    this.container = container;
    this.onResult = onResult;
    
    // Set up scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1B4965); // Darker blue background
    
    // Set up camera (orthographic for 2D-like view)
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.OrthographicCamera(-4 * aspect, 4 * aspect, 4, -4, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);
    
    // Set up renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    this.scene.add(directionalLight);
    
    // Create beautiful ground with gradient
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x2EC4B6,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    this.scene.add(ground);
    
    // Add some decorative elements
    this.addStars();
    
    // Start game
    this.createFirstBlock();
    this.createNextBlock();
    
    // Set up input
    this.container.addEventListener('click', this.onClick.bind(this));
    
    // Start animation loop
    this.animate();
  }

  private addStars() {
    // Add decorative stars in the background
    for (let i = 0; i < 20; i++) {
      const starGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const starMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFFFF,
        transparent: true,
        opacity: Math.random() * 0.8 + 0.2
      });
      const star = new THREE.Mesh(starGeometry, starMaterial);
      
      star.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 10 + 2,
        (Math.random() - 0.5) * 20
      );
      
      this.scene.add(star);
    }
  }

  private createFirstBlock() {
    const geometry = new THREE.BoxGeometry(2, 0.5, 2);
    const material = new THREE.MeshLambertMaterial({ 
      color: this.getRandomColor(),
      transparent: true,
      opacity: 0.9
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    this.currentBlock = {
      mesh,
      width: 2,
      height: 0.5,
      depth: 2,
      position: new THREE.Vector3(0, -1.75, 0)
    };
    
    mesh.position.copy(this.currentBlock.position);
    this.scene.add(mesh);
    this.blocks.push(this.currentBlock);
  }

  private createNextBlock() {
    const geometry = new THREE.BoxGeometry(2, 0.5, 2);
    const material = new THREE.MeshLambertMaterial({ 
      color: this.getRandomColor(),
      transparent: true,
      opacity: 0.9
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    this.nextBlock = {
      mesh,
      width: 2,
      height: 0.5,
      depth: 2,
      position: new THREE.Vector3(0, -1.75 + this.blocks.length * 0.5, 0)
    };
    
    mesh.position.copy(this.nextBlock.position);
    this.scene.add(mesh);
  }

  private getRandomColor(): number {
    // Kid-friendly color palette from our design system
    const colors = [
      0x2EC4B6, // primary teal
      0xFFD166, // secondary yellow
      0xEF476F, // accent raspberry
      0x118AB2, // info sky blue
      0x06D6A0, // success green
      0xFFB703, // warning amber
      0x6C5CE7, // galaxy purple
      0x5FA8D3, // space blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private onClick() {
    if (this.gameOver || !this.currentBlock || !this.nextBlock) return;
    
    this.placeBlock();
  }

  private placeBlock() {
    if (!this.currentBlock || !this.nextBlock) return;
    
    const currentPos = this.currentBlock.position;
    const nextPos = this.nextBlock.position;
    
    // Calculate overlap
    let overlap = 0;
    if (this.movingDirection === 'x') {
      overlap = Math.abs(currentPos.x - nextPos.x);
    } else {
      overlap = Math.abs(currentPos.z - nextPos.z);
    }
    
    if (overlap >= this.currentBlock.width) {
      // Game over - no overlap
      this.gameOver = true;
      playSfx('fail'); // Play fail sound
      setTimeout(() => this.onResult(this.score), 2000);
      return;
    }
    
    // Calculate new block dimensions
    const newWidth = this.movingDirection === 'x' ? this.currentBlock.width - overlap : this.currentBlock.width;
    const newDepth = this.movingDirection === 'z' ? this.currentBlock.depth - overlap : this.currentBlock.depth;
    
    // Update current block
    this.currentBlock.width = newWidth;
    this.currentBlock.depth = newDepth;
    this.currentBlock.mesh.scale.x = newWidth / 2;
    this.currentBlock.mesh.scale.z = newDepth / 2;
    
    // Position the block
    if (this.movingDirection === 'x') {
      this.currentBlock.position.x = currentPos.x + (nextPos.x - currentPos.x) / 2;
    } else {
      this.currentBlock.position.z = currentPos.z + (nextPos.z - currentPos.z) / 2;
    }
    this.currentBlock.mesh.position.copy(this.currentBlock.position);
    
    // Remove falling pieces
    if (overlap > 0) {
      this.createFallingPiece(overlap);
    }
    
    // Update score
    this.score++;
    playSfx('stack'); // Play stack sound
    
    // Prepare next block
    this.currentBlock = this.nextBlock;
    this.nextBlock = null;
    this.movingDirection = this.movingDirection === 'x' ? 'z' : 'x';
    this.movingDistance = 0;
    
    // Create new next block
    setTimeout(() => {
      this.createNextBlock();
    }, 500);
  }

  private createFallingPiece(overlap: number) {
    const geometry = new THREE.BoxGeometry(overlap, 0.5, this.movingDirection === 'x' ? this.currentBlock!.depth : this.currentBlock!.width);
    const material = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const mesh = new THREE.Mesh(geometry, material);
    
    const pos = this.currentBlock!.position.clone();
    if (this.movingDirection === 'x') {
      pos.x += this.currentBlock!.width / 2 + overlap / 2;
    } else {
      pos.z += this.currentBlock!.depth / 2 + overlap / 2;
    }
    mesh.position.copy(pos);
    
    this.scene.add(mesh);
    
    // Animate falling
    const fallSpeed = 0.05;
    const animate = () => {
      mesh.position.y -= fallSpeed;
      if (mesh.position.y > -10) {
        requestAnimationFrame(animate);
      } else {
        this.scene.remove(mesh);
      }
    };
    animate();
  }

  private animate() {
    if (!this.gameOver && this.nextBlock) {
      // Move next block
      this.movingDistance += this.movingSpeed;
      if (this.movingDistance > this.maxDistance) {
        this.movingSpeed = -this.movingSpeed;
      } else if (this.movingDistance < -this.maxDistance) {
        this.movingSpeed = -this.movingSpeed;
      }
      
      if (this.movingDirection === 'x') {
        this.nextBlock.position.x = this.movingDistance;
      } else {
        this.nextBlock.position.z = this.movingDistance;
      }
      this.nextBlock.mesh.position.copy(this.nextBlock.position);
    }
    
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }

  destroy() {
    this.container.removeEventListener('click', this.onClick);
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}

export const stackGame: Game = {
  id: 'stack',
  title: 'Tower Builder',
  engine: 'three',
  recommendedSessionSec: 90,
  difficulty: 2,
  
  mount(container: HTMLElement, onResult: (score: number) => void) {
    const game = new StackGame(container, onResult);
    (container as any).stackGame = game;
  },
  
  unmount() {
    const game = (container as any).stackGame;
    if (game) {
      game.destroy();
    }
  }
};
