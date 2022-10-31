import asyncio
from game_server import GameServer

server = GameServer()
asyncio.run(server.start())