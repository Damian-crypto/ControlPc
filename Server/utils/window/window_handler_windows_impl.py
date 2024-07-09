import win32gui, win32con
import tkinter.messagebox
import os

import win32process
from utils.window.window_handler import WindowHandler


class NativeWindowWindowsImpl(WindowHandler):
    def __init__(self):
        self.this_pid = os.getpid()

    def hide_window(self):
        try:
            def callback(hwnd, pid):
                if win32process.GetWindowThreadProcessId(hwnd)[1] == pid:
                    win32gui.ShowWindow(hwnd, win32con.SW_HIDE)

            win32gui.EnumWindows(callback, self.this_pid)
        except Exception as e:
            print(e)

    def unhide_window(self):
        try:
            def callback(hwnd, pid):
                if win32process.GetWindowThreadProcessId(hwnd)[1] == pid:
                    win32gui.ShowWindow(hwnd, win32con.SW_SHOW)

            win32gui.EnumWindows(callback, self.this_pid)
        except Exception as e:
            print(e)

    def get_pid(self):
        return self.this_pid


class WindowManager:

    def __init__(self, window_handler: WindowHandler):
        self.window_handler = window_handler

    def set_window_handler(self, window_handler: WindowHandler):
        self.window_handler = window_handler

    def get_pid(self):
        return self.window_handler.get_pid()

    def hide(self):
        self.window_handler.hide_window()

    def unhide(self):
        self.window_handler.unhide_window()

    @staticmethod
    def show_message_box(message_type: str, title: str, message: str):
        msgbox = getattr(tkinter.messagebox, f'show{message_type}')
        msgbox(title, message)
