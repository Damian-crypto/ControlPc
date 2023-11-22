from commander.Command import Command
from commander.receivers.MouseController import MouseController

class MouseSingleClickCommand(Command):

    def __init__(self, mouse: MouseController, button: str):
        self.btn = button
        self.__mouse = mouse
    
    def execute(self):
        self.__mouse.singleClick(self.btn)
    
    def undo(self):
        pass
