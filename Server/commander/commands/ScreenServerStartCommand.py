from commander.Command import Command
from utils.screen.ScreenServer import ScreenServer

class ScreenServerStartCommand(Command):

    def __init__(self, ss: ScreenServer):
        self.__ss = ss
    
    def execute(self):
        self.__ss.start()
    
    def undo(self):
        self.__ss.end()
