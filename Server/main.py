from flask import Flask, request, json, Response, render_template
# from flask_restful import Api, Resource

from commander.receivers.PowerSupply import *
from commander.receivers.MouseController import *
from utils.authentication.UUID import UUIDBuilder

from utils.screen.MultipartServer import MultipartServer

PORT = 5000
HOST = '0.0.0.0'

app = Flask(__name__)

powerSuppy = PowerSupply()
mouse = MouseController()
uuid_builder = UUIDBuilder(3).add_digits().build()
screen_server = MultipartServer()

__uuid = ''

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
                powerSuppy.sleep()
            elif cmd == "shutdown":
                powerSuppy.shutdown()
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
                mouse.singleClick(x, y, btn)
            elif cmd == "doubleclick":
                btn = data["button"]
                x, y = float(data['x']), float(data['y'])
                mouse.doubleClick(x, y, btn)
            
            print(f"Request received: {request.get_json()['command']}")
            return Response(f'Request executed: {request.get_json()["command"]}', status=200)
        else:
            return Response(f'Request rejected: Invalid identity', status=401)
    
    return Response(b'Request received', status=200)

@app.route("/screensize")
def mouseControls():
    dim = screen_server.get_screen_size()
    return json.dumps(dim)

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
    # __uuid = uuid_builder.generate_one()
    __uuid = "pfe"
    print(f'Use this key as your identity: {__uuid}')

    app.run(debug=False, host=HOST, port=PORT, threaded=True)
