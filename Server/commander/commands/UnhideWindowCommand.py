from commander.Command import Command
from utils.window.WindowManager import WindowManager

class WindowUnhideCommand(Command):

    def __init__(self):
        pass
    
    def execute(self):
        WindowManager.unhide()
    
    def undo(self):
        WindowManager.hide()
