import os

from utils.process.ProcessExecutable import ProcessExecutable
from utils.process.Result import Result

class SystemExecutor(ProcessExecutable):

    def __init__(self):
        pass
    
    def run(self, cmd: str = '') -> Result:
        returncode = os.system(cmd)
        return Result('', '', returncode)
