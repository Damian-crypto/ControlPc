from commander.Command import Command
from utils.window.WindowManager import WindowManager

class WindowHideCommand(Command):

    def __init__(self):
        pass
    
    def execute(self):
        WindowManager.hide()
    
    def undo(self):
        WindowManager.unhide()
