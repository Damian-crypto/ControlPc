import threading
import cv2
import pyautogui
import numpy as np

from utils.screen.ScreenServer import ScreenServer

class MultipartServer(ScreenServer):

    def __init__(self):
        self.running = False
        self.mode = 'Screen'
        self.camport = 0

    def start(self):
        self.running = True
        print('Screen server started working!')
        # t = threading.Thread(target=self.__video_loop)

    def set_cam_port(self, port):
        self.camport = port

    def end(self):
        self.running = False
        print('Screen server stopped working!')

    def change_view(self, view, port=0):
        self.mode = view
        self.camport = port
        print(f'Screen server changed mode: {view}, port: {port}')
    
    def get_screen_size(self):
        width, height = pyautogui.size()
        return { 'width': width, 'height': height }

    def get_screen_frame(self):
        try:
            while self.running and self.mode == 'Screen':
                image = pyautogui.screenshot()
                frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
                ret, buffer = cv2.imencode('.jpg', frame)
                bytes = buffer.tobytes()
                yield (b'--frame\r\n'
                    # b'Content-Type: text/plain\r\n\r\n' + bytes + b'\r\n')
                    b'Content-Type: image/jpeg\r\n\r\n' + bytes + b'\r\n')
        except KeyboardInterrupt:
            cv2.destroyAllWindows()

    def get_cam_frame(self):
        cam = cv2.VideoCapture(0)

        while self.running and self.mode == 'Camera':
            success, image = cam.read()
            if not success:
                break
            ret, buffer = cv2.imencode('.jpg', image)
            bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                # b'Content-Type: text/plain\r\n\r\n' + bytes + b'\r\n')
                b'Content-Type: image/jpeg\r\n\r\n' + bytes + b'\r\n')
        
        del(cam)
    
    def get_frame(self):
        if self.mode == 'Screen':
            yield from self.get_screen_frame()
        elif self.mode == 'Camera':
            yield from self.get_cam_frame()
