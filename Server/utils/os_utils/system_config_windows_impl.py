from abc import ABC

import os
import winreg
import pathlib

from utils.configurator.configurator import Configurator
from utils.os_utils.system_config import SystemConfig


def file_exists_or_create(filepath: str, create_one=False) -> bool:
    file = pathlib.Path(filepath)
    base = os.getcwd()
    if create_one:
        if file.is_file():
            return True
        else:
            autorun_script = f'@ECHO OFF\nCD /d "{base}"\nSTART /b /min .\\controlpc\\Scripts\\pythonw.exe main.py'

            with open(filepath, "w") as f:
                f.write(autorun_script)
        return True

    return file.is_file()


class WindowsSystemConfig(SystemConfig, ABC):

    def __init__(self, configurator: Configurator):
        if configurator.get_property("run_at_startup"):
            cwd = os.getcwd()
            addr = os.path.join(cwd, "controlpc.bat")
            file_exists_or_create(addr, True)

    def add_to_startup(self) -> bool:
        try:
            cwd = os.getcwd()
            addr = os.path.join(cwd, "controlpc.bat")
            if not file_exists_or_create(addr, True):
                return False

            sub_key = r"Software\\Microsoft\\Windows\\CurrentVersion\\Run"
            reg_key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, sub_key, 0, winreg.KEY_ALL_ACCESS)
            winreg.SetValueEx(reg_key, "controlpc_startup", 0, winreg.REG_SZ, addr)
            winreg.CloseKey(reg_key)
            print("ControlPc added as a startup program")
        except Exception as err:
            print("ControlPc not added as a startup program due an error", err)
            return False

        return True

    def remove_from_startup(self) -> bool:
        try:
            sub_key = r"Software\\Microsoft\\Windows\\CurrentVersion\\Run"
            reg_key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, sub_key, 0, winreg.KEY_ALL_ACCESS)
            # Note:
            # In Windows registry editor keys are shown as folder in the left pane
            # values are shown as some items in the right pane when selected a key.
            winreg.DeleteValue(reg_key, "controlpc_startup")
            winreg.CloseKey(reg_key)
            print("ControlPc removed from the startup programs")
        except Exception as err:
            print("ControlPc not removed from startup programs due an error", err)
            return False

        return True
