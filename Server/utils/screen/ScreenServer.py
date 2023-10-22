import socket
import pyautogui
import cv2
import pickle
import struct
import numpy as np
import threading

class ScreenServer:

    def __init__(self, host='0.0.0.0', port=5001):
        self.host = host
        self.port = port
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.bind((host, port))
        self.screen_thread = None
        self.screen_capturing = True
    
    def start(self):
        self.server_socket.listen(5)
        print(f'Screen server started and listening on {self.host}:{self.port}...')
    
    def accept(self):
        client_socket, addr = self.server_socket.accept()
        self.client_socket = client_socket
        self.client_addr = addr
        print(f'Accepted client: {addr}')

        self.screen_thread = threading.Thread(target=self.__screen_loop).start()

    def end(self):
        self.screen_capturing = False
        self.server_socket.close()
        self.screen_thread.join()

    def __screen_loop(self):
        try:
            while self.screen_capturing:
                screen = pyautogui.screenshot()
                frame = cv2.cvtColor(np.array(screen), cv2.COLOR_RGB2BGR)

                # Serialize frame
                data = pickle.dumps(frame)
                data_size = struct.pack("L", len(data))

                self.client_socket.send(data_size + data)
        except KeyboardInterrupt:
            self.server_socket.close()
            cv2.destroyAllWindows()
