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
        pyautogui.move(x, y)
    
    def singleClick(self, x, y, btn):
        self.mouseX = x
        self.mouseY = y
        self.dragging = True
        self.prvButton = btn
        pyautogui.click(x, y, button=btn)
    
    def doubleClick(self, x, y, btn):
        self.mouseX = x
        self.mouseY = y
        self.dragging = True
        self.prvButton = btn
        pyautogui.click(x, y, clicks=2, button=btn)

    def mouseReleased(self, x, y, btn):
        self.mouseX = x
        self.mouseY = y
        self.dragging = False
    
    def mouseScroll(self):
        pass
