from ScreenServer import ScreenServer

server = ScreenServer()
server.start()
while True:
    server.accept()
