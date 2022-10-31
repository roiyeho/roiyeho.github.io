import asyncio
import websockets
from websockets.client import WebSocketClientProtocol
import json
import logging
from game import Game
from players import Player

class GameServer:
  def __init__(self):
    logging.basicConfig()    
    self.first_player_connected = False
    self.clients = set()

  async def client_handler(self, websocket: WebSocketClientProtocol):
    """Handle a connection and dispatch it according to who is connecting.
    """    
    # Wait for a connection message from the client
    message = await websocket.recv()

    if not self.first_player_connected:     
      print('First player connected')
      self.board_size = json.loads(message)['boardSize']
      print('Board size:', self.board_size)
      self.clients.add(websocket)
      self.first_player_connected = True
      await self.play(websocket, Player.X)
    else:
      # Second player joins an existing game
      print('Second player connected')
      self.clients.add(websocket)      
      self.start_game()
      self.first_player_connected = False
      await self.play(websocket, Player.O)

  def start_game(self):
    self.game = Game(self.board_size)    
    
    # Send a message for the start of the game to both players
    message = {
      'type': 'start',
      'boardSize': self.board_size    
    }
    websockets.broadcast(self.clients, json.dumps(message))

  async def play(self, websocket: WebSocketClientProtocol, player):
    """Receive and process moves from a player
    """
    try:
      async for move_message in websocket:
        # Parse a move object from the client
        move = json.loads(move_message)
        row = move['row']
        column = move['column']
        print(f'Received move: {row}, {column}')

        if not self.game.is_valid_move(row, column):
          print('Illegal move')
          # Send an "error" message if the move was illegal
          message = {
            'type': 'error',          
            'error': 'Illegal move!'
          }
          await websocket.send(json.dumps(message))
          print(message)
        else:
          # Play the move
          self.game.play(player, row, column)
        
          # Send a "play" message to update the UI
          message = {
            'type': 'play',
            'player': player,
            'row': row,
            'column': column
          }
          websockets.broadcast(self.clients, json.dumps(message))

          # If the move is winning, send an "end" event
          winner = self.game.get_winner() 
          if not winner is None:                
            message = {
              'type': 'end',
              'player': winner          
            }
            websockets.broadcast(self.clients, json.dumps(message))
    finally:
      self.clients.remove(websocket)

  async def start(self):
    async with websockets.serve(self.client_handler, 'localhost', 8080):
      print('Server started')
      await asyncio.Future()