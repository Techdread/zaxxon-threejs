import * as THREE from 'three';

export class Player {
    constructor(scene, inputHandler) {
        this.scene = scene;
        this.inputHandler = inputHandler;
        this.health = 100;
        this.score = 0;
        this.speed = 15;
        this.mesh = null;
        this.projectiles = [];
        this.lastShot = 0;
        this.shootCooldown = 250; // milliseconds

        this.init();
    }

    init() {
        // Create player ship geometry
        const geometry = new THREE.ConeGeometry(1, 3, 4);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00ff00,
            flatShading: true
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.set(0, 5, 0);
        
        this.scene.add(this.mesh);
    }

    update(delta) {
        if (!this.inputHandler || !this.mesh) return;

        // Handle movement
        if (this.inputHandler.isPressed('ArrowLeft')) {
            this.mesh.position.x -= this.speed * delta;
        }
        if (this.inputHandler.isPressed('ArrowRight')) {
            this.mesh.position.x += this.speed * delta;
        }
        if (this.inputHandler.isPressed('ArrowUp')) {
            this.mesh.position.y += this.speed * delta;
        }
        if (this.inputHandler.isPressed('ArrowDown')) {
            this.mesh.position.y -= this.speed * delta;
        }

        // Clamp position within bounds
        this.mesh.position.x = Math.max(-9, Math.min(9, this.mesh.position.x));
        this.mesh.position.y = Math.max(1, Math.min(12, this.mesh.position.y));

        // Handle shooting
        if (this.inputHandler.isPressed('Space')) {
            const now = Date.now();
            if (now - this.lastShot >= this.shootCooldown) {
                this.shoot();
                this.lastShot = now;
            }
        }
        
        // Update projectiles
        this.projectiles.forEach((projectile, index) => {
            projectile.position.z -= 30 * delta;
            
            // Remove projectiles that have gone too far
            if (projectile.position.z < -100) {
                this.scene.remove(projectile);
                this.projectiles.splice(index, 1);
            }
        });
    }

    shoot() {
        const projectileGeometry = new THREE.SphereGeometry(0.2);
        const projectileMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
        
        projectile.position.copy(this.mesh.position);
        projectile.position.z -= 2;
        
        this.scene.add(projectile);
        this.projectiles.push(projectile);
    }

    takeDamage(amount) {
        this.health -= amount;
        document.getElementById('health').textContent = this.health;
        
        if (this.health <= 0) {
            this.die();
        }
    }

    addScore(points) {
        this.score += points;
        document.getElementById('score').textContent = this.score;
    }

    die() {
        // Implement death animation and game over logic
        console.log('Game Over');
    }
}
