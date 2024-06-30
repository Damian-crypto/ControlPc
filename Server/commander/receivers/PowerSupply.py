import os
import threading
import platform


class PowerSupply:

    def sleep(self):
        threading.Thread(target=self.__send_sleep, daemon=True).start()

    def shutdown(self):
        threading.Thread(target=self.__send_shutdown(), daemon=True).start()

    def restart(self):
        threading.Thread(target=self.__send_restart(), daemon=True).start()

    def turn_on(self):
        pass

    def __send_sleep(self):
        operating_system = platform.system()
        if operating_system == "Windows":
            os.chdir('res/')
            os.system('psshutdown64.exe -d -t 0')
            os.chdir('..')
        elif operating_system == "Linux":
            pass
        elif operating_system == "Darwin":
            pass

    def __send_shutdown(self):
        operating_system = platform.system()
        if operating_system == "Windows":
            os.chdir('res/')
            os.system('psshutdown64.exe -s -t 0')
        elif operating_system == "Linux":
            pass
        elif operating_system == "Darwin":
            pass

    def __send_restart(self):
        operating_system = platform.system()
        if operating_system == "Windows":
            os.chdir('res/')
            os.system('psshutdown64.exe -r -t 0')
        elif operating_system == "Linux":
            pass
        elif operating_system == "Darwin":
            pass
