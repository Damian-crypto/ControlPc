import os

from utils.executor.ProcessExecutable import ProcessExecutable
from utils.executor.Result import Result

class SystemExecutor(ProcessExecutable):

    def __init__(self):
        pass
    
    def run(self, cmd: str = '') -> Result:
        returncode = os.system(cmd)
        return Result('', '', returncode)
