from commander.Command import Command
from commander.receivers.keyboard_controller import KeyboardController

class KeyReleasedCommand(Command):

    def __init__(self, controller: KeyboardController):
        self.__keyboard = controller
        self.keyCode = ''
    
    def setKeyCode(self, keyCode: str):
        self.keyCode = keyCode
    
    def execute(self):
        self.__keyboard.key_released(self.keyCode)
    
    def undo(self):
        self.__keyboard.key_pressed(self.keyCode)
