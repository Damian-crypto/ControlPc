import sys
import threading

from functools import wraps
from waitress import serve
from flask import Flask, request, json, Response, render_template
# from flask_restful import Api, Resource

from Invoker import Invoker

from commander.receivers.PowerSupply import PowerSupply
from commander.receivers.MouseController import MouseController
from commander.receivers.KeyboardController import KeyboardController

from commander.commands.MouseDoubleClickCommand import MouseDoubleClickCommand
from commander.commands.MouseSingleClickCommand import MouseSingleClickCommand
from commander.commands.PowerSupplyShutdownCommand import PowerSupplyShutdownCommand
from commander.commands.PowerSupplySleepCommand import PowerSupplySleepCommand
from commander.commands.HideWindowCommand import WindowHideCommand
from commander.commands.UnhideWindowCommand import WindowUnhideCommand
from commander.commands.ScreenServerStartCommand import ScreenServerStartCommand
from commander.commands.ScreenServerEndCommand import ScreenServerEndCommand
from commander.commands.ScreenServerChangeViewCommand import ScreenServerChangeViewCommand
from commander.commands.KeyPressedCommand import KeyPressedCommand
from commander.commands.KeyReleasedCommand import KeyReleasedCommand

from utils.authentication import *

from utils.authentication.UUID import UUIDBuilder
from utils.screen.MultipartServer import MultipartServer
from utils.window.WindowManager import WindowManager
from utils.executor.PopenExecutor import PopenExecutor
from utils.executor.SystemExecutor import SystemExecutor
from utils.qr.QRGenerator import QRGenerator
from utils.geolocator.geolocator import GeoLocationManager
from utils.networking.ipaddress import IPAddress

PORT = 5000
HOST = '0.0.0.0'

app = Flask(__name__)
app.config['DEBUG'] = True

powerSuppy = PowerSupply()
mouse = MouseController()
keyboard = KeyboardController()
uuid_builder = UUIDBuilder(10).add_digits().build()
screen_server = MultipartServer()

invoker = Invoker()
invoker.setCommand("sleep", PowerSupplySleepCommand(powerSuppy))
invoker.setCommand("shutdown", PowerSupplyShutdownCommand(powerSuppy))
mouseSingleLeftClick = MouseSingleClickCommand(mouse, 'left')
mouseSingleRightClick = MouseSingleClickCommand(mouse, 'right')
mouseDoubleLeftClick = MouseDoubleClickCommand(mouse, 'left')
mouseDoubleRightClick = MouseDoubleClickCommand(mouse, 'right')
invoker.setCommand("mouse_singleclick_left", mouseSingleLeftClick)
invoker.setCommand("mouse_singleclick_right", mouseSingleRightClick)
invoker.setCommand("mouse_doubleclick_left", mouseDoubleLeftClick)
invoker.setCommand("mouse_doubleclick_right", mouseDoubleRightClick)
invoker.setCommand("window_hide", WindowHideCommand())
invoker.setCommand("window_unhide", WindowUnhideCommand())
screenServerStart = ScreenServerStartCommand(screen_server)
screenServerEnd = ScreenServerEndCommand(screen_server)
screenServerCam = ScreenServerChangeViewCommand(screen_server, 'Camera')
screenServerDisplay = ScreenServerChangeViewCommand(screen_server, 'Screen')
invoker.setCommand("screenserver_start", screenServerStart)
invoker.setCommand("screenserver_end", screenServerEnd)
invoker.setCommand("screenserver_Camera", screenServerCam)
invoker.setCommand("screenserver_Screen", screenServerDisplay)
keyPressed = KeyPressedCommand(keyboard)
invoker.setCommand("keyboard_pressed", keyPressed)

__uuid = ''


def validate_identity(fun):
    @wraps(fun)
    def wrapper():
        if request.is_json:
            data = request.get_json()
            uuid = ''
            if "uuid" in data:
                uuid = data["uuid"]
                if uuid == __uuid:
                    return fun()

            return invalid_identity()

        return invalid_request_format()

    return wrapper


def invalid_request_format():
    return Response(b'Invalid request format', status=400)


def invalid_identity():
    return Response("Invalid identity", status=403, mimetype='application/json')


@app.route('/')
def welcome():
    return Response(f'Welcome to the ControlPc (Server is up at {HOST}:{PORT})', status=200)


@app.route("/command", methods=["POST"])
@validate_identity
def command():
    data = request.get_json()
    cmd = data["command"]

    # Mouse related pre-actions
    if cmd[:5] == "mouse":
        mouse.setPosition(float(data['x']), float(data['y']))

    # Live screen related pre-actions
    elif cmd[:12] == "screenserver" and "camport" in data:
        port = data["camport"]
        if len(port) == 0 or port == '':
            port = int(port.strip())
            screen_server.set_cam_port(port)

    # Keyboard related pre-actions
    elif cmd[:8] == "keyboard":
        key = data["keyCode"]
        keyPressed.setKeyCode(key)

    invoker.on(cmd)

    # print(f"Request received: {request.get_json()['command']}")
    return Response(f'Action invoked: {request.get_json()["command"]}', status=200)


@app.route("/connect", methods=["POST"])
@validate_identity
def connect():
    return Response("Authenticated", status=200, mimetype='application/json')


@app.route("/screensize")
def screen_size():
    dim = screen_server.get_screen_size()
    return json.dumps(dim)


@app.route("/screenstream")
def screen_stream():
    return Response(screen_server.get_frame(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route("/remote")
def remote():
    return render_template('index.html')


@app.route("/terminal", methods=["POST"])
@validate_identity
def run_in_terminal():
    data = request.get_json()
    if "primaryCmd" in data and "secondaryCmd" in data:
        cmd1 = data["primaryCmd"]
        cmd2 = data["secondaryCmd"]
        terminal = PopenExecutor()
        res = terminal.run(cmd1).get_as_dictionary()

        return json.dumps(res)

    return invalid_request_format()


@app.route("/geo_location", methods=["POST"])
@validate_identity
def get_geo_location():
    return json.dumps(GeoLocationManager.get_geolocation())


def show_qr():
    localip = IPAddress.get_local_ip()
    QRGenerator.generate(f"{localip} {PORT} {__uuid}", title='You identity')


if __name__ == '__main__':
    __uuid = uuid_builder.generate_one()
    if len(sys.argv) > 1 and sys.argv[1] == 'hidden':
        WindowManager.hide()
    qrThread = threading.Thread(target=show_qr, daemon=True)
    qrThread.start()
    # WindowManager.showMessageBox('info', 'Identity', f'Your identity is: {__uuid}')
    print(f'Use this key as your identity: {__uuid}')

    # app.run(debug=False, host=HOST, port=PORT, threaded=True)
    serve(app, host=HOST, port=PORT)
