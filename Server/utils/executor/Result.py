class Result:

    def __init__(self, output: str, error: str, returncode: int):
        self.__output = output
        self.__error = error
        self.__returncode = 0

    # Properties
    @property
    def output(self) -> str:
        return self.__output

    @property
    def error(self) -> str:
        return self.__error
    
    @property
    def returncode(self) -> int:
        return self.__returncode
    
    @property
    def output_dict(self) -> dict:
        return {
            'output': self.__output,
            'error': self.__error,
            'returnCode': self.__returncode
        }
    
    # Getter/Setters
    def get_output(self) -> str:
        return self.__output
    
    def set_output(self, output: str):
        self.__output = output

    def get_error(self) -> str:
        return self.__error

    def set_error(self, error: str):
        self.__error = error
    
    def set_returncode(self, returncode: int):
        self.__returncode = returncode
    
    def get_returncode(self) -> int:
        return self.__returncode
    
    def get_as_dictionary(self) -> dict:
        return {
            'output': self.__output,
            'error': self.__error,
            'returnCode': self.__returncode
        }
