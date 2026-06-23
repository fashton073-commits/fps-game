// Game initialization and main loop
let scene, camera, renderer;
let player;
let enemies = [];
let gameActive = true;
let frameCount = 0;
let lastTime = Date.now();

function initGame() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 500, 1000);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 1.6; // Eye level

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create some obstacles
    createObstacles();

    // Initialize player
    player = new Player(camera);

    // Spawn initial enemies
    spawnEnemies(5);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Lock pointer on click
    document.addEventListener('click', () => {
        renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || 
                                                renderer.domElement.mozRequestPointerLock;
        renderer.domElement.requestPointerLock();
    });

    // Start game loop
    animate();
}

function createObstacles() {
    const obstacles = [
        { x: 50, z: 50, width: 20, height: 30, depth: 20 },
        { x: -80, z: 100, width: 15, height: 25, depth: 15 },
        { x: 100, z: -100, width: 25, height: 20, depth: 25 },
        { x: -100, z: -80, width: 30, height: 15, depth: 20 },
    ];

    obstacles.forEach(obs => {
        const geometry = new THREE.BoxGeometry(obs.width, obs.height, obs.depth);
        const material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(obs.x, obs.height / 2, obs.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
    });
}

function spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const distance = 80 + Math.random() * 40;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const enemy = new Enemy(x, z, scene);
        enemies.push(enemy);
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Update
    if (gameActive) {
        player.update();
        
        enemies.forEach((enemy, index) => {
            enemy.update(player);
            
            // Check if enemy is dead
            if (enemy.health <= 0) {
                scene.remove(enemy.mesh);
                enemies.splice(index, 1);
                
                // Spawn new enemy
                const angle = Math.random() * Math.PI * 2;
                const distance = 100;
                const x = Math.cos(angle) * distance;
                const z = Math.sin(angle) * distance;
                const newEnemy = new Enemy(x, z, scene);
                enemies.push(newEnemy);
            }
        });

        // Check collisions with enemies
        enemies.forEach(enemy => {
            const distance = camera.position.distanceTo(enemy.mesh.position);
            if (distance < 2) {
                player.takeDamage(1);
            }
        });
    }

    // Update HUD
    document.getElementById('health').textContent = Math.max(0, player.health);
    document.getElementById('ammo').textContent = player.ammo;
    updateFPS();

    // Render
    renderer.render(scene, camera);
}

function updateFPS() {
    frameCount++;
    const currentTime = Date.now();
    if (currentTime - lastTime >= 1000) {
        document.getElementById('fps').textContent = frameCount;
        frameCount = 0;
        lastTime = currentTime;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the game when page loads
window.addEventListener('load', initGame);
