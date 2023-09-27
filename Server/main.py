from flask import Flask, request
# from flask_restful import Api, Resource

import commander.Command as Command
from commander.receivers import *
from commander.commands import *
from Controller import Controller

app = Flask(__name__)

controller = Controller()
powerSuppy = PowerSupply.PowerSupply()
sleepCmd = PowerSupplyShutdownCommand.PowerSupplyShutdownCommand(powerSuppy)

controller.setCommand("sleep", sleepCmd)

@app.route('/')
def welcome():
    return 'Welcome to the ControlPc'

@app.route("/command", methods=["POST"])
def command():
    if request.is_json:
        cmd = request.get_json()["command"]
        if cmd == "sleep":
            controller.on("sleep")
        
        print(request.get_json()["command"])
    
    return f"Executing request: { request.get_json()['command'] }"

if __name__ == '__main__':
    app.run(debug=True)
