import os
import threading

from commander.receivers.power_supply import PowerSupply


class PowerSupplyWindowsImpl(PowerSupply):

    def sleep(self):
        threading.Thread(target=self.__send_sleep, daemon=True).start()

    def shutdown(self):
        threading.Thread(target=self.__send_shutdown(), daemon=True).start()

    def restart(self):
        threading.Thread(target=self.__send_restart(), daemon=True).start()

    def turn_on(self):
        pass

    def __send_sleep(self):
        os.chdir('res/')
        os.system('psshutdown64.exe -d -t 0')
        os.chdir('..')

    def __send_shutdown(self):
        os.chdir('res/')
        os.system('psshutdown64.exe -s -t 0')

    def __send_restart(self):
        os.chdir('res/')
        os.system('psshutdown64.exe -r -t 0')
