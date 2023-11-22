from commander.Command import Command
from utils.process.ProcessExecutor import ProcessExecutor

class TerminalRunCommand(Command):

    def __init__(self):
        self.__pe = None
    
    def setEngine(self, pe: ProcessExecutor):
        self.__pe = pe
    
    def setCommands(self,secondaryCmd: str):
        self.sc = secondaryCmd
    
    def execute(self):
        self.__pe.run(self.secondaryCmd)
    
    def undo(self):
        pass
