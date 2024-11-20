import * as THREE from 'three';

export class Level {
    constructor(scene) {
        this.scene = scene;
        this.scrollSpeed = 10;
        this.segments = [];
        this.segmentLength = 100; 
        this.activeSegments = 3; 
        this.enemies = [];
        this.lastEnemySpawn = 0;
        this.enemySpawnInterval = 2000; 
        
        this.init();
    }

    init() {
        for (let i = 0; i < this.activeSegments; i++) {
            this.createSegment(i * this.segmentLength);
        }
    }

    createSegment(zPosition) {
        const segment = new THREE.Group();
        
        const floorGeometry = new THREE.PlaneGeometry(20, this.segmentLength);
        const floorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            side: THREE.DoubleSide
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.z = -zPosition - this.segmentLength / 2;
        segment.add(floor);

        this.createWalls(segment, zPosition);

        this.addObstacles(segment, zPosition);

        this.scene.add(segment);
        this.segments.push(segment);
    }

    createWalls(segment, zPosition) {
        const wallSegments = 5; 
        const segmentLength = this.segmentLength / wallSegments;

        for (let i = 0; i < wallSegments; i++) {
            const wallHeight = 6 + Math.random() * 6; 
            const wallGeometry = new THREE.BoxGeometry(1, wallHeight, segmentLength);
            const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });

            const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
            leftWall.position.set(-10, wallHeight / 2, -zPosition - (i * segmentLength) - segmentLength / 2);
            segment.add(leftWall);

            const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
            rightWall.position.set(10, wallHeight / 2, -zPosition - (i * segmentLength) - segmentLength / 2);
            segment.add(rightWall);
        }
    }

    createFlyingEnemy() {
        const enemy = new THREE.Group();
        
        const bodyGeometry = new THREE.ConeGeometry(1, 2, 4);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        enemy.add(body);

        const wingGeometry = new THREE.BoxGeometry(3, 0.2, 1);
        const wingMaterial = new THREE.MeshPhongMaterial({ color: 0xcc0000 });
        const wings = new THREE.Mesh(wingGeometry, wingMaterial);
        enemy.add(wings);

        const x = Math.random() * 16 - 8;
        const y = 5 + Math.random() * 7; 
        const z = -this.segmentLength * (this.activeSegments - 1);
        enemy.position.set(x, y, z);

        enemy.userData.speed = 5 + Math.random() * 5;
        enemy.userData.direction = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            1
        ).normalize();
        enemy.userData.timeOffset = Math.random() * Math.PI * 2;

        this.scene.add(enemy);
        this.enemies.push(enemy);
    }

    addObstacles(segment, zPosition) {
        const obstacleCount = Math.floor(Math.random() * 5) + 3;
        
        for (let i = 0; i < obstacleCount; i++) {
            const type = Math.floor(Math.random() * 3);
            let obstacle;

            switch(type) {
                case 0: 
                    obstacle = new THREE.Mesh(
                        new THREE.BoxGeometry(2, 2, 2),
                        new THREE.MeshPhongMaterial({ color: 0x8888ff })
                    );
                    break;
                case 1: 
                    obstacle = new THREE.Mesh(
                        new THREE.CylinderGeometry(1, 1, 3, 8),
                        new THREE.MeshPhongMaterial({ color: 0x88ff88 })
                    );
                    break;
                case 2: 
                    obstacle = new THREE.Mesh(
                        new THREE.ConeGeometry(1.5, 3, 4),
                        new THREE.MeshPhongMaterial({ color: 0xff8888 })
                    );
                    break;
            }
            
            obstacle.position.x = Math.random() * 16 - 8;
            obstacle.position.y = obstacle.geometry.parameters.height / 2;
            obstacle.position.z = -zPosition - Math.random() * this.segmentLength;
            
            obstacle.rotation.y = Math.random() * Math.PI * 2;
            
            segment.add(obstacle);
        }
    }

    update(delta) {
        this.segments.forEach((segment) => {
            segment.position.z += this.scrollSpeed * delta;
        });

        if (this.segments[0].position.z > this.segmentLength) {
            this.scene.remove(this.segments[0]);
            this.segments.shift();

            const lastSegmentZ = this.segments[this.segments.length - 1].position.z;
            this.createSegment(-lastSegmentZ - this.segmentLength);
        }

        const now = Date.now();
        if (now - this.lastEnemySpawn > this.enemySpawnInterval) {
            this.createFlyingEnemy();
            this.lastEnemySpawn = now;
        }

        this.enemies.forEach((enemy, index) => {
            enemy.position.z += this.scrollSpeed * delta;

            const time = now * 0.001 + enemy.userData.timeOffset;
            enemy.position.x += Math.sin(time) * delta * enemy.userData.speed * 0.5;
            enemy.position.y += Math.cos(time) * delta * enemy.userData.speed * 0.3;

            if (enemy.position.z > 20) {
                this.scene.remove(enemy);
                this.enemies.splice(index, 1);
            }

            enemy.position.x = Math.max(-9, Math.min(9, enemy.position.x));
            enemy.position.y = Math.max(3, Math.min(12, enemy.position.y));
        });
    }
}
