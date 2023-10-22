from abc import ABC, abstractmethod

class MessageBox(ABC):

    def __init__(self, message: str):
        self.msg = message
