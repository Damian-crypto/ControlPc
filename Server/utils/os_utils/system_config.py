from abc import ABC, abstractmethod


class SystemConfig(ABC):

    @abstractmethod
    def add_to_startup(self) -> bool:
        pass

    @abstractmethod
    def remove_from_startup(self) -> bool:
        pass
