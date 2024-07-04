import pyautogui


class MouseController:

    def __init__(self):
        self.dragging = False
        self.mouseX = 0
        self.mouseY = 0
        self.prvButton = -1

    def move(self, x, y):
        self.mouseX = x
        self.mouseY = y
        pyautogui.move(self.mouseX, self.mouseY)

    def single_click(self, btn):
        self.dragging = True
        self.prvButton = btn
        pyautogui.click(self.mouseX, self.mouseY, button=btn)

    def double_click(self, btn):
        self.dragging = True
        self.prvButton = btn
        pyautogui.click(self.mouseX, self.mouseY, clicks=2, button=btn)

    def mouse_released(self, btn):
        self.dragging = False

    def set_position(self, x, y):
        self.mouseX = x
        self.mouseY = y

    def mouse_scroll(self):
        pass
