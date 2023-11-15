from commander.Command import Command
from commander.receivers.MouseController import MouseController

class MouseDoubleClickCommand(Command):

    def __init__(self, mouse: MouseController):
        self.x = 0
        self.y = 0
        self.btn = 0
        self.__mouse = mouse
    
    def execute(self):
        self.__mouse.doubleClick(self.x, self.y, self.btn)
    
    def undo(self):
        pass
