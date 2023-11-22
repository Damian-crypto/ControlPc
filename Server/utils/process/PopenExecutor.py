import subprocess

from utils.process.ProcessExecutable import ProcessExecutable
from utils.process.Result import Result

class PopenExecutor(ProcessExecutable):

    def __init__(self):
        pass
    
    def run(self, cmd: str = '') -> Result:
        self.__proc = subprocess.Popen(cmd,
                                       shell=True,
                                       stdout=subprocess.PIPE,
                                       stderr=subprocess.PIPE,
                                       stdin=subprocess.PIPE)
        
        out, err = self.__proc.communicate()

        return Result(out.decode(), err.decode(), self.__proc.returncode)
