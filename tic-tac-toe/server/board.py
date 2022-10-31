import numpy as np
from players import Player

class Board:
  def __init__(self, size):
    self.size = size
    self.mat = np.zeros((self.size, self.size), dtype=int)
  
  def __getitem__(self, pos):
    return self.mat[pos[0], pos[1]]

  def __setitem__(self, pos, player):    
    self.mat[pos[0], pos[1]] = player

  def get_winner(self):
    # Check rows    
    if np.any(np.all(self.mat == Player.X, axis=1)):
      return Player.X
    if np.any(np.all(self.mat == Player.O, axis=1)):
      return Player.O
    
    # Check columns
    if np.any(np.all(self.mat == Player.X, axis=0)):
      return Player.X
    if np.any(np.all(self.mat == Player.O, axis=0)):
      return Player.O

    # Check diagonals
    main_diagonal = np.diag(self.mat)
    if np.all(main_diagonal == Player.X):
      return Player.X
    if np.all(main_diagonal == Player.O):
      return Player.O

    secondary_diagonal = np.diag(self.mat[:, ::-1])
    if np.all(secondary_diagonal == Player.X):
      return Player.X
    if np.all(secondary_diagonal == Player.O):
      return Player.O

    # Check for draw (the whole board is full)
    if not np.any(self.mat == 0):
      return 0
    
    return None