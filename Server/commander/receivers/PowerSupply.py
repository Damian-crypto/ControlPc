import os
import threading

class PowerSupply:

    def sleep(self):
        threading.Thread(target=self.__send_sleep).start()
    
    def shutdown(self):
        print('Shutting down...')

    def turnOn(self):
        pass

    def __send_sleep(self):
        os.chdir('res/')
        os.system('psshutdown64.exe -d -t 0')
        os.chdir('..')
