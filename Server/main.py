import sys
import os
import threading
import platform

from functools import wraps
from waitress import serve
from flask import Flask, request, json, Response, render_template

from Invoker import Invoker

from commander.receivers.power_supply_windows_impl import PowerSupplyWindowsImpl
from commander.receivers.mouse_controller import MouseController
from commander.receivers.keyboard_controller import KeyboardController

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

from utils.authentication.UUID import UUIDBuilder
from utils.screen.MultipartServer import MultipartServer
from utils.window.window_handler_windows_impl import WindowManager, NativeWindowWindowsImpl
from utils.executor.PopenExecutor import PopenExecutor
from utils.qr.QRGenerator import QRGenerator
from utils.geolocator.geolocator import GeoLocationManager
from utils.networking.ipaddress import IPAddress
from utils.process_manager import ProcessManager
from utils.configurator.configurator import Configurator
from utils.gui.pyfile_runner import start_gui
from utils.os_utils.system_config_windows_impl import WindowsSystemConfig

PORT = 5000
HOST = '0.0.0.0'

app = Flask(__name__)
# app.config['DEBUG'] = True

configurator = Configurator("cpcconfig.yaml")
mouse = MouseController()
keyboard = KeyboardController()
uuid_builder = UUIDBuilder(10).add_digits().build()
screen_server = MultipartServer()

power_supply = None
system_config = None
window_manager = None
window_handler = None
# Windows platform configurations
if platform.system() == "Windows":
    power_supply = PowerSupplyWindowsImpl()
    system_config = WindowsSystemConfig(configurator)
    window_handler = NativeWindowWindowsImpl()

# Common configurations
window_manager = WindowManager(window_handler)

invoker = Invoker()
invoker.setCommand("sleep", PowerSupplySleepCommand(power_supply))
invoker.setCommand("shutdown", PowerSupplyShutdownCommand(power_supply))
mouseSingleLeftClick = MouseSingleClickCommand(mouse, 'left')
mouseSingleRightClick = MouseSingleClickCommand(mouse, 'right')
mouseDoubleLeftClick = MouseDoubleClickCommand(mouse, 'left')
mouseDoubleRightClick = MouseDoubleClickCommand(mouse, 'right')
invoker.setCommand("mouse_singleclick_left", mouseSingleLeftClick)
invoker.setCommand("mouse_singleclick_right", mouseSingleRightClick)
invoker.setCommand("mouse_doubleclick_left", mouseDoubleLeftClick)
invoker.setCommand("mouse_doubleclick_right", mouseDoubleRightClick)
invoker.setCommand("window_hide", WindowHideCommand(window_handler))
invoker.setCommand("window_unhide", WindowUnhideCommand(window_handler))
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
        mouse.set_position(float(data['x']), float(data['y']))

    # Live screen related pre-actions
    elif cmd[:12] == "screenserver" and "camport" in data:
        port = data["camport"]
        if port != '':
            port = int(port)
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


@app.route('/running_processes', methods=['POST'])
@validate_identity
def get_running_processes():
    proc_list = ProcessManager.get_process_list()
    return json.dumps(proc_list)


@app.route('/get_resource_usage', methods=['POST'])
@validate_identity
def get_resource_usage():
    stat = {
        'cpu': ProcessManager.get_cpu_usage(),
        'ram': ProcessManager.get_ram_usage()
    }
    return json.dumps(stat)


def generate_qr() -> QRGenerator:
    qrgen = QRGenerator()
    localip = configurator.get_property("host_address")
    qrgen.generate(f"{localip} {PORT} {__uuid}", title='You identity')

    return qrgen


def show_qr(qrgen: QRGenerator):
    qrgen.show_qr()


def main():
    global __uuid
    if configurator.get_property("secret_key") is None:
        __uuid = uuid_builder.generate_one()
    else:
        __uuid = configurator.get_property("secret_key")

    if not configurator.get_property("show_window"):
        window_manager.hide()

    def run_at_startup(value) -> bool:
        success = False
        if value:
            success = system_config.add_to_startup()
        else:
            success = system_config.remove_from_startup()

        return success

    configurator.set_local_property("secret_key", __uuid)
    configurator.set_on_change_event("run_at_startup", run_at_startup)
    configurator.set_local_property("pid", str(window_manager.get_pid()))
    global HOST, PORT
    HOST = configurator.get_property("host_address")
    PORT = configurator.get_property("host_port")
    generate_qr()

    t = threading.Thread(target=lambda app, uuid: app(uuid), args=(start_server, __uuid,))
    t.daemon = True
    t.start()

    start_gui(configurator, window_manager)


def start_server(uuid):
    print(f"Serving on {HOST}:{PORT} -- {uuid}")
    # app.run(host=HOST, port=PORT, debug=False)
    serve(app, host=HOST, port=PORT)
    print(f"Stopped serving on {HOST}:{PORT} -- {uuid}")


if __name__ == '__main__':
    main()
