class GameClient {
  #serverUrl
  #gameStarted
  #moveReceived
  #gameEnded
  /** @type {WebSocket} */
  #websocket

  constructor(serverUrl, gameStarted, moveReceived, gameEnded) {
    this.#serverUrl = serverUrl;
    this.#gameStarted = gameStarted;
    this.#moveReceived = moveReceived;
    this.#gameEnded = gameEnded;
  }

  initGame(boardSize) {
    this.#websocket = new WebSocket(this.#serverUrl);
    this.#websocket.addEventListener('open', () => {
      // Send an "init" message to the server
      const message = {
        type: 'init',
        boardSize
      };
      this.#websocket.send(JSON.stringify(message));
      this.#receiveMoves();
    });    
  }

  joinGame() {    
    this.#websocket = new WebSocket(this.#serverUrl);
    this.#websocket.addEventListener('open', () => {
      // Send a "join" event to the server
      const message = {
        type: 'join'
      };
      this.#websocket.send(JSON.stringify(message));
      this.#receiveMoves();
    });
  }

  sendMove(row, column) {
    // Send a "play" event to the server
    const message = {
      type: 'play',
      row,
      column
    }
    this.#websocket.send(JSON.stringify(message));
  }

  #receiveMoves() {
    this.#websocket.addEventListener('message', e => {
      const message = JSON.parse(e.data);
      console.log(message);
      
      switch (message.type) {
        case 'start':
          // The game starts when the second player joins
          this.#gameStarted(message.boardSize);
          break;
        case 'play':
          // Update the UI with the move
          this.#moveReceived(message.player, message.row, message.column);
          break;
        case 'error':
          alert(message.error);
          break;
        case 'end':          
          let gameEndMessage;
          if (message.player == 0) {
            gameEndMessage = 'Game ended in a draw';
          } else {
            gameEndMessage = `Player ${message.player} wins!`;
          }
          setTimeout(alert(gameEndMessage, 100));
          
          // No further messages are expected; close the connection
          this.#websocket.close();
          this.#gameEnded();
          break;
        default:
          throw new Error(`Unsupported message type: ${message.type}`);
      }
    });
  }
}

export default GameClient;