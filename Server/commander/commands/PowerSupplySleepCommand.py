from commander.Command import Command
from commander.receivers.power_supply import PowerSupply

class PowerSupplySleepCommand(Command):

    def __init__(self, ps: PowerSupply):
        self.__ps = ps
    
    def execute(self):
        self.__ps.sleep()

    def undo(self):
        self.__ps.turnOn()
