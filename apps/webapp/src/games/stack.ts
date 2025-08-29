import * as THREE from 'three';
import { Game } from '@illara-camp/shared';

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
    this.scene.background = new THREE.Color(0x87CEEB);
    
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
    
    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    this.scene.add(ground);
    
    // Start game
    this.createFirstBlock();
    this.createNextBlock();
    
    // Set up input
    this.container.addEventListener('click', this.onClick.bind(this));
    
    // Start animation loop
    this.animate();
  }

  private createFirstBlock() {
    const geometry = new THREE.BoxGeometry(2, 0.5, 2);
    const material = new THREE.MeshLambertMaterial({ color: this.getRandomColor() });
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
    const material = new THREE.MeshLambertMaterial({ color: this.getRandomColor() });
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
    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xfeca57, 0xff9ff3];
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
