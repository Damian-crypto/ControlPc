import pyautogui


class KeyboardController:

    def __init__(self):
        pass

    def key_pressed(self, keyCode):
        print('Pressed', keyCode)
        pyautogui.keyDown(keyCode)

    def key_released(self, keyCode):
        pyautogui.keyUp(keyCode)
