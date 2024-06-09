import socket


class IPAddress:

    @staticmethod
    def get_local_ip() -> str:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        host = s.getsockname()[0]
        s.close()

        return host
