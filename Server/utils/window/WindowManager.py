import win32gui, win32con
import tkinter.messagebox

class WindowManager:

    @staticmethod
    def hide():
        try:
            target = win32gui.GetForegroundWindow()
            win32gui.ShowWindow(target, win32con.SW_HIDE)
        except Exception as e:
            print(e)

    @staticmethod
    def unhide():
        try:
            target = win32gui.GetForegroundWindow()
            win32gui.ShowWindow(target, win32con.SW_SHOW)
        except Exception as e:
            print(e)

    @staticmethod
    def showMessageBox(type: str, title: str, message: str):
        msgbox = getattr(tkinter.messagebox, f'show{type}')
        msgbox(title, message)
