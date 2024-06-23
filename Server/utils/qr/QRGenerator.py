import pyqrcode
import cv2


class QRGenerator:
    def __init__(self):
        self.title = ""
        self.content = ""

    def show_qr(self):
        img = cv2.imread('QR.png')

        cv2.putText(img, self.content, (20, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)

        cv2.imshow(self.title, img)

        cv2.waitKey(0)

        cv2.destroyAllWindows()

    def generate(self, content: str, scale: int = 8, title: str = 'QR Code') -> None:
        self.content = content
        self.title = title
        url = pyqrcode.create(content)
        url.png(file='QR.png', scale=scale)
