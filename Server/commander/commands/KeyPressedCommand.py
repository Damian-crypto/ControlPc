from commander.Command import Command
from commander.receivers.KeyboardController import KeyboardController

class KeyPressedCommand(Command):

    def __init__(self, controller: KeyboardController):
        self.__keyboard = controller
        self.keyCode = ''
    
    def setKeyCode(self, keyCode: str):
        self.keyCode = keyCode
    
    def execute(self):
        self.__keyboard.keyPressed(self.keyCode)
    
    def undo(self):
        self.__keyboard.keyReleased(self.keyCode)
