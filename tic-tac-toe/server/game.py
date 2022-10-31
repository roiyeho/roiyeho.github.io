from board import Board
from players import Player

class Game: 
  def __init__(self, board_size=3):
    self.board_size = board_size
    self.board = Board(board_size)    

  def play(self, player, row, column):    
    self.board[row, column] = player   

  def is_valid_move(self, row, column):    
    if row < 0 or row >= self.board_size or column < 0 or column >= self.board_size \
      or self.board[row, column] != 0:
      return False
    return True

  def get_winner(self):
    return self.board.get_winner()