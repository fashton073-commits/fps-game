// Player controller
class Player {
    constructor(camera) {
        this.camera = camera;
        this.health = 100;
        this.maxHealth = 100;
        this.ammo = 30;
        this.maxAmmo = 30;
        this.speed = 0.3;
        this.velocity = new THREE.Vector3();
        
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.canShoot = true;
        this.shootCooldown = 100; // milliseconds
        this.lastShotTime = 0;
        
        this.setupControls();
    }

    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            if (e.key === 'r' || e.key === 'R') {
                this.reload();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Mouse look
        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === renderer.domElement) {
                this.mouseX += e.movementX * 0.01;
                this.mouseY += e.movementY * 0.01;

                // Clamp vertical look
                this.mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.mouseY));
            }
        });

        // Shooting
        document.addEventListener('click', () => {
            this.shoot();
        });
    }

    update() {
        // Movement
        const moveVector = new THREE.Vector3();

        if (this.keys['w']) moveVector.z -= 1;
        if (this.keys['s']) moveVector.z += 1;
        if (this.keys['a']) moveVector.x -= 1;
        if (this.keys['d']) moveVector.x += 1;

        // Apply rotation to movement vector
        moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mouseX);
        moveVector.normalize();
        moveVector.multiplyScalar(this.speed);

        this.camera.position.add(moveVector);

        // Camera rotation
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.mouseX;
        this.camera.rotation.x = this.mouseY;

        // Keep player at ground level (with eye height)
        if (this.camera.position.y < 1.6) {
            this.camera.position.y = 1.6;
        }

        // Boundary check
        const maxBound = 250;
        this.camera.position.x = Math.max(-maxBound, Math.min(maxBound, this.camera.position.x));
        this.camera.position.z = Math.max(-maxBound, Math.min(maxBound, this.camera.position.z));
    }

    shoot() {
        if (this.ammo <= 0 || !this.canShoot) return;

        this.ammo--;
        this.canShoot = false;

        // Raycasting for hit detection
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

        if (enemies.length > 0) {
            const hits = raycaster.intersectObjects(enemies.map(e => e.mesh));
            if (hits.length > 0) {
                const hitEnemy = enemies.find(e => e.mesh === hits[0].object);
                if (hitEnemy) {
                    hitEnemy.takeDamage(50);
                }
            }
        }

        // Cooldown
        setTimeout(() => {
            this.canShoot = true;
        }, this.shootCooldown);
    }

    reload() {
        this.ammo = this.maxAmmo;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            gameActive = false;
            alert(`Game Over! Final Health: ${Math.max(0, this.health)}`);
        }
    }
}
