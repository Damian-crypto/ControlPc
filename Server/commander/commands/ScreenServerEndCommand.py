from commander.Command import Command
from utils.screen.ScreenServer import ScreenServer

class ScreenServerEndCommand(Command):

    def __init__(self, ss: ScreenServer):
        self.__ss = ss
    
    def execute(self):
        self.__ss.end()
    
    def undo(self):
        self.__ss.start()
