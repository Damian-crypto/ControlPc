from commander.Command import Command
from utils.window.window_handler_windows_impl import WindowManager, WindowHandler


class WindowUnhideCommand(Command):

    def __init__(self, window_handler: WindowHandler):
        self.window_manager = WindowManager(window_handler)

    def execute(self):
        self.window_manager.unhide()

    def undo(self):
        self.window_manager.hide()
