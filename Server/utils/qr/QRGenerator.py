import pyqrcode
import cv2

class QRGenerator:

    @staticmethod
    def generate(content: str, scale: int=8, title: str = 'QR Code'):
        url = pyqrcode.create(content)
        url.png(file='QR.png', scale=scale)

        img = cv2.imread('QR.png')

        cv2.putText(img, content, (20, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)

        cv2.imshow(title, img)

        cv2.waitKey(0)

        cv2.destroyAllWindows()
