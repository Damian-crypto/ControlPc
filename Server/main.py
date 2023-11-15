from flask import Flask, request, json, Response, render_template
# from flask_restful import Api, Resource

import commander.Command as Command
from Controller import Controller
from commander.receivers.PowerSupply import *
from commander.receivers.MouseController import *
from commander.commands.PowerSupplyShutdownCommand import PowerSupplyShutdownCommand
from commander.commands.PowerSupplySleepCommand import PowerSupplySleepCommand
from commander.commands.MouseSingleClickCommand import MouseSingleClickCommand
from commander.commands.MouseDoubleClickCommand import MouseDoubleClickCommand
from utils.authentication.UUID import UUIDBuilder

from utils.screen.MultipartServer import MultipartServer

PORT = 5000
HOST = '0.0.0.0'

app = Flask(__name__)

controller = Controller()
powerSuppy = PowerSupply()
shutdownCmd = PowerSupplyShutdownCommand(powerSuppy)
sleepCmd = PowerSupplySleepCommand(powerSuppy)

mouse = MouseController()
mouseSingleClickCmd = MouseSingleClickCommand(mouse)
mouseDoubleClickCmd = MouseDoubleClickCommand(mouse)

uuid_builder = UUIDBuilder(3).add_digits().build()

__uuid = ''

controller.setCommand("shutdown", shutdownCmd)
controller.setCommand("sleep", sleepCmd)
controller.setCommand("singleClick", mouseSingleClickCmd)
controller.setCommand("doubleClick", mouseDoubleClickCmd)

screen_server = MultipartServer()

@app.route('/')
def welcome():
    return Response(f'Welcome to the ControlPc (Server is up at {HOST}:{PORT})', status=200)

@app.route("/command", methods=["POST"])
def command():
    if request.is_json:
        data = request.get_json()
        print(data)
        id = ''
        if "uuid" in data:
            id = data["uuid"]
        if id == __uuid:
            cmd = data["command"]
            if cmd == "sleep":
                controller.on("sleep")
            elif cmd == "shutdown":
                controller.on("shutdown")
            elif cmd == "screenserver":
                view = data["view"]
                act = data["act"]
                port = data["camport"]
                if len(port) == 0 or port == '':
                    port = int(port.strip())
                if act == 'start':
                    print(f"Starts with {view}")
                    screen_server.start()
                    screen_server.change_view(view)
                    screen_server.set_cam_port(port)
                else:
                    screen_server.end()
            elif cmd == "singleclick":
                btn = data["button"]
                x, y = float(data['x']), float(data['y'])
                mouseSingleClickCmd.btn = btn
                mouseSingleClickCmd.x = x
                mouseSingleClickCmd.y = y
                controller.on("singleClick")
            elif cmd == "doubleclick":
                btn = int(data["button"])
                mouseDoubleClickCmd.btn = btn
                controller.on("doubleClick")
            
            print(f"Request received: {request.get_json()['command']}")
            return Response(f'Request executed: {request.get_json()["command"]}', status=200)
        else:
            return Response(f'Request rejected: Invalid identity', status=401)
    
    return json.dumps(data)

@app.route("/connect", methods=["POST"])
def connect():
    if request.is_json:
        data = request.get_json()
        # print(data)
        id = ''
        if "uuid" in data:
            id = data["uuid"]
        if id == __uuid:
            return Response("Authenticated", status=200, mimetype='application/json')
    
    return Response("Invalid identity", status=403, mimetype='application/json')

@app.route("/screenstream")
def screen_stream():
    return Response(screen_server.get_frame(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route("/remote")
def remote():
    return render_template('index.html')

if __name__ == '__main__':
    __uuid = uuid_builder.generate_one()
    print(f'Use this key as your identity: {__uuid}')

    app.run(debug=False, host=HOST, port=PORT, threaded=True)
