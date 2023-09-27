from commander.Command import Command
from collections import defaultdict

class NoCommand(Command):
    def execute(self):
        pass
    def undo(self):
        pass

class Controller:

    def __init__(self):
        self.__commands = defaultdict(Command)
        self.noCommand = NoCommand()

    def setCommand(self, name: str, cmd: Command):
        self.__commands[name] = cmd
        self.__commands[f"undo{name}"] = self.noCommand
    
    def on(self, name: str):
        self.__commands[name].execute()
        self.__commands[f"undo{name}"] = self.__commands[name]
