import threading
import cv2
import pyautogui
import numpy as np
import mss

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

    def change_view(self, view, port=-1):
        self.mode = view
        if port != -1:
            self.camport = port
        # print(f'Screen server changed mode: {self.mode}, port: {self.camport}')

    def __get_screen_dims(self):
        screen_tool = mss.mss()

        return screen_tool.monitors[self.camport]

    def get_screen_size(self):
        box = self.__get_screen_dims()

        return {'width': box['width'], 'height': box['height']}

    def get_screen_frame(self):
        box = self.__get_screen_dims()

        try:
            while self.running and self.mode == 'Screen':
                image = pyautogui.screenshot(allScreens=True)
                image = image.crop((box['left'], box['top'], box['left'] + box['width'], box['height']))
                frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
                ret, buffer = cv2.imencode('.jpg', frame)
                frame_bytes = buffer.tobytes()
                yield (b'--frame\r\n'
                       # b'Content-Type: text/plain\r\n\r\n' + frame_bytes + b'\r\n')
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        except KeyboardInterrupt:
            cv2.destroyAllWindows()

    def get_cam_frame(self):
        cam = cv2.VideoCapture(0)

        while self.running and self.mode == 'Camera':
            success, image = cam.read()
            if not success:
                break
            ret, buffer = cv2.imencode('.jpg', image)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   # b'Content-Type: text/plain\r\n\r\n' + frame_bytes + b'\r\n')
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        del cam

    def get_frame(self):
        if self.mode == 'Screen':
            yield from self.get_screen_frame()
        elif self.mode == 'Camera':
            yield from self.get_cam_frame()
