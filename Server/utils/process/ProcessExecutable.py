from abc import ABC, abstractmethod

from utils.process.Result import Result

class ProcessExecutable(ABC):
    
    @abstractmethod
    def run(self, cmd: str) -> Result:
        pass
