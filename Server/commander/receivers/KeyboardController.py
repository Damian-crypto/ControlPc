import pyautogui

class KeyboardController:

    def __init__(self):
        pass

    def keyPressed(self, keyCode):
        pyautogui.keyDown(keyCode)

    def keyReleased(self, keyCode):
        pyautogui.keyUp(keyCode)
