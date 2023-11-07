from abc import ABC, abstractmethod

# Screen Server should have
# 1. Power button
# 2. Change the view button (webcam, screen)

class ScreenServer(ABC):

    @abstractmethod
    def start(self):
        pass

    @abstractmethod
    def end(self):
        pass

    @abstractmethod
    def change_view(self, view, port=0):
        pass
