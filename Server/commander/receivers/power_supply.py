from abc import ABC, abstractmethod


class PowerSupply:

    @abstractmethod
    def sleep(self):
        pass

    @abstractmethod
    def shutdown(self):
        pass

    @abstractmethod
    def restart(self):
        pass

    @abstractmethod
    def turn_on(self):
        pass
