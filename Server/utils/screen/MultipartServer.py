import threading
import cv2
import pyautogui
import numpy as np

from utils.screen.ScreenServer import ScreenServer

class MultipartServer(ScreenServer):

    def __init__(self):
        self.running = False
        self.mode = 'screen'

    def start(self):
        self.running = True
        # t = threading.Thread(target=self.__video_loop)

    def end(self):
        self.running = False

    def change_view(self, view):
        self.mode = view
    
    def get_screen_frame(self):
        try:
            while self.running:
                screen = pyautogui.screenshot()
                frame = cv2.cvtColor(np.array(screen), cv2.COLOR_RGB2BGR)
                imgencoded = cv2.imencode('.jpg', frame)[1]
                bytes = imgencoded.tobytes()
                yield (b'--frame\r\n'
                    # b'Content-Type: text/plain\r\n\r\n' + bytes + b'\r\n')
                    b'Content-Type: image/jpeg\r\n\r\n' + bytes + b'\r\n')
        except KeyboardInterrupt:
            cv2.destroyAllWindows()

    def get_cam_frame(self):
        cam = cv2.VideoCapture(0)

        while self.running:
            success, image = cam.read()
            if not success:
                break
            ret, buffer = cv2.imencode('.jpg', image)[1]
            bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                # b'Content-Type: text/plain\r\n\r\n' + bytes + b'\r\n')
                b'Content-Type: image/jpeg\r\n\r\n' + bytes + b'\r\n')
    
    def get_frame(self):
        if self.mode == 'screen':
            yield self.get_screen_frame()
        elif self.mode == 'cam':
            yield self.get_cam_frame()
