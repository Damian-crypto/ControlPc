from flask import Flask, request, json, Response
# from flask_restful import Api, Resource

import commander.Command as Command
from commander.receivers.PowerSupply import *
from commander.commands.PowerSupplyShutdownCommand import PowerSupplyShutdownCommand
from commander.commands.PowerSupplySleepCommand import PowerSupplySleepCommand
from Controller import Controller
from utils.authentication.UUID import UUIDBuilder

PORT = 5000
HOST = '0.0.0.0'

app = Flask(__name__)

controller = Controller()
powerSuppy = PowerSupply()
shutdownCmd = PowerSupplyShutdownCommand(powerSuppy)
sleepCmd = PowerSupplySleepCommand(powerSuppy)
uuid_builder = UUIDBuilder(3).add_digits().build()

__uuid = ''

controller.setCommand("shutdown", shutdownCmd)
controller.setCommand("sleep", sleepCmd)

@app.route('/')
def welcome():
    return f'Welcome to the ControlPc (Server is up at {HOST}:{PORT})'

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
            
            print(f"Request received: {request.get_json()['command']}")

            data = {
                'status': 200,
                'message': f'Request executed: {request.get_json()["command"]}'
            }
        else:
            data = {
                'status': 200,
                'message': f'Request rejected: Invalid identity'
            }
    
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

if __name__ == '__main__':
    __uuid = uuid_builder.generate_one()
    print(f'Use this key as your identity: {__uuid}')

    app.run(debug=False, host=HOST, port=PORT)
