from typing import Dict, Any
import yaml


def load_yaml_file(filepath: str):
    data = None
    with open(filepath, 'r') as file:
        data = yaml.safe_load(file)

    return data


def write_yaml_file(filepath: str, data: Any):
    with open(filepath, 'w') as file:
        yaml.dump(data, file)


class Configurator:
    def __init__(self, filepath="", file_loader=load_yaml_file, file_writer=write_yaml_file):
        self.config = {}
        self.local_config = {}
        self.filepath = filepath
        self.file_loader = file_loader
        self.file_writer = file_writer
        self.load_file()

    def load_file(self):
        self.config = {}
        data = self.file_loader(self.filepath)["control_pc"]["server"]
        self.config["show_window"] = data["show_window"]
        self.config["qr_code_path"] = data["qr_code_path"]
        self.config["host_address"] = data["host_address"]
        self.config["host_port"] = data["host_port"]

    def write_file(self):
        data = {
            "control_pc": {
                "server": self.config
            }
        }
        self.file_writer(self.filepath, data)

    def get_property(self, name: str) -> Any:
        if name in self.config:
            return self.config[name]
        elif name in self.local_config:
            return self.local_config[name]

        return ""

    def set_local_property(self, name: str, value: str):
        self.local_config[name] = value

    def set_property(self, name: str, value: str):
        self.config[name] = value
        self.write_file()

    def get_all_properties(self) -> Dict[str, Any]:
        return self.config
