from commander.Command import Command
from utils.window.WindowManager import WindowManager, WindowHandler


class WindowHideCommand(Command):

    def __init__(self, window_handler: WindowHandler):
        self.window_manager = WindowManager(window_handler)

    def execute(self):
        self.window_manager.hide()

    def undo(self):
        self.window_manager.unhide()
