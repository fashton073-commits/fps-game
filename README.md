# Simple FPS Game

A basic first-person shooter game built with Three.js and vanilla JavaScript.

## Features

- **Player Movement**: WASD keys to move around
- **Mouse Look**: Move your mouse to look around (click to lock pointer)
- **Shooting**: Left click to shoot enemies
- **Enemies**: AI enemies that hunt you down
- **Health System**: Both player and enemies have health
- **Ammo System**: Limited ammo, press R to reload
- **Obstacles**: Environmental obstacles to take cover behind

## Controls

| Key | Action |
|-----|--------|
| **W** | Move Forward |
| **A** | Move Left |
| **S** | Move Backward |
| **D** | Move Right |
| **Mouse** | Look Around (click to lock) |
| **Left Click** | Shoot |
| **R** | Reload |

## How to Play

1. Open `index.html` in a web browser
2. Click on the game to lock your mouse
3. Use WASD to move around
4. Use mouse to aim
5. Click to shoot enemies
6. Avoid contact with enemies or your health will decrease
7. Try to survive as long as possible!

## Game Mechanics

- **Player Health**: Start with 100 HP
- **Ammo**: 30 bullets per magazine
- **Enemy Spawning**: New enemy spawns when one is defeated
- **Enemy AI**: Simple pathfinding toward the player
- **Damage**: Each shot deals 50 damage to enemies

## Project Structure

```
fps-game/
├── index.html        # Main HTML file
├── js/
│   ├── game.js      # Main game loop and initialization
│   ├── player.js    # Player controller and mechanics
│   ├── enemy.js     # Enemy AI
│   └── weapons.js   # Weapons system
└── README.md        # This file
```

## Future Enhancements

- Different weapon types
- Particle effects for gunshots
- Sound effects
- More enemy types
- Waves/levels
- Powerups
- Multiplayer support
- Better graphics and textures

## Requirements

- Modern web browser with WebGL support
- Internet connection (for Three.js CDN)

## Running the Game

Simply open `index.html` in your browser. No build process or server required!

Enjoy!
