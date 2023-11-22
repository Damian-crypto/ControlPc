class Result:

    def __init__(self, output: str, error: str, returncode: int):
        self.output = output
        self.error = error
        self.returncode = 0
    
    def get_output(self) -> str:
        return self.output
    
    def set_output(self, output: str):
        self.output = output

    def get_error(self) -> str:
        return self.error

    def set_error(self, error: str):
        self.error = error
    
    def set_returncode(self, returncode: int):
        self.returncode = returncode
    
    def get_returncode(self) -> int:
        return self.returncode
    
    def get_as_dictionary(self) -> dict:
        return {
            'output': self.output,
            'error': self.error,
            'returnCode': self.returncode
        }
