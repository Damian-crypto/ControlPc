import commander.Command as Command
from receivers.PowerSupply import PowerSupply

class PowerSupplyShutdownCommand(Command):

    def __init__(self, ps: PowerSupply):
        self.__ps = ps
    
    def execute(self):
        self.__ps.shutdown()
    
    def undo(self):
        self.__ps.turnOn()
