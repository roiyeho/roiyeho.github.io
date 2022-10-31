import Board from "./board.js";
import GameClient from "./game_client.js";
import Player from "./player.js";

const connectForm = document.getElementById('connect-form');
const sizeInput = document.getElementById('size');
const btnStartGame = document.getElementById('start-game');
const btnJoinGame = document.getElementById('join-game');
const waitMessage = document.getElementById('wait-message');
const gameArea = document.getElementById('game-area');
const boardElement = document.getElementById('board');
const statusBar = document.getElementById('status');

const url = 'ws://localhost:8080';
const client = new GameClient(url, gameStarted, moveReceived, gameEnded);
let currPlayer;

btnStartGame.addEventListener('click', () => {
  const boardSize = Number(sizeInput.value);
  currPlayer = Player.X;
  client.initGame(boardSize);  
  connectForm.hidden = true;
  waitMessage.hidden = false;
});

btnJoinGame.addEventListener('click', () => {
  currPlayer = Player.O;
  client.joinGame();  
  connectForm.hidden = true;
});

let board;

function gameStarted(boardSize) {
  waitMessage.hidden = true;
  gameArea.hidden = false; 
  board = new Board(boardSize, client, currPlayer, boardElement, statusBar);
  board.draw();
}

function moveReceived(player, row, column) {
  board.updateMove(player, row, column);
}

function gameEnded() {
  statusBar.hidden = true;
}