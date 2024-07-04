from abc import ABC, abstractmethod


class WindowHandler(ABC):

    @abstractmethod
    def hide_window(self):
        pass

    @abstractmethod
    def unhide_window(self):
        pass

    @abstractmethod
    def get_pid(self):
        return 0
