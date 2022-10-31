import GameClient from "./game_client.js";
import Player from "./player.js";

class Board {
  #boardSize 
  /** @type {GameClient} */
  #client
  #player
  #boardElement
  #statusBar
  #cellSize  
  #waitingForMove
  #playerImages

  constructor(boardSize, client, player, boardElement, statusBar) {
    this.#boardSize = boardSize;    
    this.#client = client;
    this.#player = player; 
    this.#boardElement = boardElement;
    this.#statusBar = statusBar;
    this.#cellSize = this.#boardElement.clientWidth / this.#boardSize;
    
    this.#playerImages = [];
    this.#playerImages[0] = 'images/player-x.png';
    this.#playerImages[1] = 'images/player-o.png';

    if (this.#player == Player.X) {
      this.#statusBar.textContent = 'It is your turn';
      this.#waitingForMove = false;
    } else {
      this.#statusBar.textContent = 'Waiting for opponent to play...';
      this.#waitingForMove = true;
    }    
  }

  draw() {
    for (let i = 0; i < this.#boardSize; i++) {
      const rowElement = document.createElement('div');
      rowElement.className = 'row';
      for (let j = 0; j < this.#boardSize; j++) {
        const cellElement = document.createElement('div');
        cellElement.className = 'cell';
        cellElement.style.width = this.#cellSize + 'px';
        cellElement.style.height = this.#cellSize + 'px';
        cellElement.dataset.row = i;
        cellElement.dataset.column = j;    
        rowElement.appendChild(cellElement);
      }
      this.#boardElement.appendChild(rowElement);      
    }

    this.#boardElement.addEventListener('click', e => { 
      this.#playMove(e.target);
    });
  }

  #playMove(cell) {
    if (this.#waitingForMove) {
      return;
    }

    // Ignore clicks outside a cell
    if (cell.dataset.row === undefined) {
      return;
    }
    const row = Number(cell.dataset.row);
    const column = Number(cell.dataset.column);    
    this.#client.sendMove(row, column);
    this.#waitingForMove = true;
    this.#statusBar.textContent = 'Waiting for opponent to play...';
  }

  updateMove(player, row, column) {    
    const cellElement = this.#boardElement.querySelector(`div[data-row="${row}"][data-column="${column}"]`);
    const image = new Image();
    image.src = this.#playerImages[player - 1];
    image.width = 0.9 * this.#cellSize;
    cellElement.appendChild(image);   

    if (player != this.#player) {
      this.#waitingForMove = false;
      this.#statusBar.textContent = 'It is your turn';
    }
  }
}

export default Board;