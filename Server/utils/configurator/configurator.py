from typing import Dict, Any, Callable
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
        self.on_events = {}
        self.load_file()

    def load_file(self):
        self.config = {}
        data = self.file_loader(self.filepath)["control_pc"]["server"]
        self.config["show_window"] = data.get("show_window", None)
        self.config["qr_code_path"] = data.get("qr_code_path", None)
        self.config["host_address"] = data.get("host_address", None)
        self.config["host_port"] = data.get("host_port", None)
        self.config["run_at_startup"] = data.get("run_at_startup", None)
        self.config["secret_key"] = data.get("secret_key", None)

    def write_file(self):
        data = {
            "control_pc": {
                "server": self.config
            }
        }
        self.file_writer(self.filepath, data)

    def get_property(self, name: str) -> Any:
        if name in self.config and self.config[name] is not None:
            return self.config[name]
        elif name in self.local_config and self.local_config[name] is not None:
            return self.local_config[name]

        return None

    def set_local_property(self, name: str, value: Any):
        self.local_config[name] = value

    def set_property(self, name: str, value: Any):
        if name in self.on_events:
            if self.on_events[name](value):
                self.config[name] = value
        self.write_file()

    def set_on_change_event(self, property_name: str, callback: Callable[[Any], bool]) -> None:
        self.on_events[property_name] = callback

    def get_all_properties(self) -> Dict[str, Any]:
        props = self.config.copy()
        props.update(self.local_config)

        return props
