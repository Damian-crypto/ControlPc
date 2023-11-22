from commander.Command import Command
from utils.screen.ScreenServer import ScreenServer

class ScreenServerChangeViewCommand(Command):

    def __init__(self, ss: ScreenServer, view: str):
        self.__ss = ss
        self.view = view
    
    def execute(self):
        self.__ss.change_view(self.view)
    
    def undo(self):
        pass
