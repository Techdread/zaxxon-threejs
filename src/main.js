import * as THREE from 'three';
import { Game } from './game/Game.js';
import { Player } from './game/Player.js';
import { Level } from './game/Level.js';
import { InputHandler } from './game/InputHandler.js';

// Initialize the game
const game = new Game();
game.init();
