from commander.Command import Command
from commander.receivers.mouse_controller import MouseController

class MouseSingleClickCommand(Command):

    def __init__(self, mouse: MouseController, button: str):
        self.btn = button
        self.__mouse = mouse
    
    def execute(self):
        self.__mouse.single_click(self.btn)
    
    def undo(self):
        pass
