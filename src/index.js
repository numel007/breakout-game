import Game from './game.js';

const doc = document;
const canvas = document.getElementById('myCanvas');
const game = new Game(canvas, doc);

game.runGame();
