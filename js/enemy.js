// Enemy AI
class Enemy {
    constructor(x, z, scene) {
        this.scene = scene;
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 0.1;
        this.attackRange = 50;
        this.attackCooldown = 1000;
        this.lastAttackTime = 0;
        this.detectionRange = 150;

        // Create mesh
        const geometry = new THREE.BoxGeometry(1.5, 2.5, 1.5);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, 1.25, z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);

        // Health bar
        this.createHealthBar();
    }

    createHealthBar() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(0, 0, canvas.width * (this.health / this.maxHealth), canvas.height);
        
        const texture = new THREE.CanvasTexture(canvas);
        const geometry = new THREE.PlaneGeometry(3, 0.5);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const healthBar = new THREE.Mesh(geometry, material);
        healthBar.position.y = 3;
        this.mesh.add(healthBar);
        
        this.healthBarCanvas = canvas;
        this.healthBarMaterial = material;
    }

    update(player) {
        const distanceToPlayer = this.mesh.position.distanceTo(player.camera.position);

        if (distanceToPlayer < this.detectionRange) {
            // Move towards player
            const direction = new THREE.Vector3();
            player.camera.position.sub(this.mesh.position, direction);
            direction.normalize();
            direction.multiplyScalar(this.speed);
            this.mesh.position.add(direction);

            // Attack if in range
            if (distanceToPlayer < this.attackRange) {
                const now = Date.now();
                if (now - this.lastAttackTime > this.attackCooldown) {
                    player.takeDamage(10);
                    this.lastAttackTime = now;
                }
            }
        }

        // Update health bar
        this.updateHealthBar();
    }

    updateHealthBar() {
        const canvas = this.healthBarCanvas;
        const ctx = canvas.getContext('2d');
        const healthPercent = Math.max(0, this.health / this.maxHealth);
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(0, 0, canvas.width * healthPercent, canvas.height);
        
        this.healthBarMaterial.map.needsUpdate = true;
    }

    takeDamage(amount) {
        this.health -= amount;
    }
}
