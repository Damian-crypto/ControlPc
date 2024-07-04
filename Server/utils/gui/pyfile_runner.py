import sys
from PySide6 import QtWidgets
from PySide6 import QtCore
from PySide6.QtWidgets import QTreeWidgetItem, QStyledItemDelegate
from PySide6.QtGui import QPixmap, QIcon

from utils.gui import MainWindow
from utils.configurator.configurator import Configurator

from utils.window.window_handler_windows_impl import WindowHandler, WindowManager

# When you run your application, Windows looks at the executable and tries to
# guess what "application group" it belongs to. By default, any Python scripts
# (including your application) are grouped under the same "Python" group, and so
# will show the Python icon. To stop this happening, we need to provide Windows
# with a different application identifier.
try:
    from ctypes import windll  # Only exists on Windows.

    myappid = 'mycompany.myproduct.subproduct.version'
    windll.shell32.SetCurrentProcessExplicitAppUserModelID(myappid)
except ImportError:
    pass


def beautify_props(config: Configurator):
    props = config.get_all_properties()
    data = {}
    for key, value in props.items():
        key_words = key.split("_")
        new_key = " ".join([word.capitalize() for word in key_words])

        data[new_key] = {
            "value": value,
            "key": key,
            "action": lambda _key, _val: config.set_property(_key, _val)
        }

    return data


class SettingsPage:
    def __init__(self, config: Configurator):
        self.config = config

    def get_widgets(self):
        return beautify_props(self.config)


# Here I added custom properties __key and __type.
# Otherwise, it is hard to invoke the callback function with correct data type.
# This all because, I show more user-friendly property keys than the configuration properties.
# So, all configuration in file in the format of propname1_propname2...
# the above format will be converted to Propertyname1 Propertyname2 in the GUI.
# internal_key is the actual property key in config file.
class CustomQTreeWidgetItem(QTreeWidgetItem):
    def __init__(self, *args, **kwargs):
        super().__init__(*args)
        self.__key = kwargs["internal_key"] if "internal_key" in kwargs else None
        self.__type = kwargs["item_type"] if "item_type" in kwargs else None

    def get_internal_key(self):
        return self.__key

    @property
    def item_type(self):
        return self.__type


class KeyEditableDelegate(QStyledItemDelegate):
    def createEditor(self, parent, option, index):
        if index.column() == 0:  # Allow editing only for the first column (key)
            return None  # Return None to make the cell non-editable
        return super().createEditor(parent, option, index)


class MainWindow(QtWidgets.QMainWindow, MainWindow.Ui_MainWindow, WindowHandler):
    def __init__(self, conf: Configurator):
        super(MainWindow, self).__init__()
        self.setupUi(self)
        self.setWindowTitle("ControlPC Server 1.0v")
        # icon = QIcon("static/images/icon.png")
        # self.setWindowIcon(icon)

        self.tree_Settings.setColumnWidth(0, 215)

        self.setup_settings_tab(conf)
        self.setup_home_tab(conf)

    def setup_home_tab(self, configurator: Configurator):
        pixmap = QPixmap(configurator.get_property("qr_code_path"))
        self.lbl_Image.setPixmap(pixmap)
        self.lbl_ServerPort.setText(configurator.get_property("host_port"))
        self.lbl_ServerAddress.setText(configurator.get_property("host_address"))
        self.lbl_Secret.setText(str(configurator.get_property("secret_key")))

    def setup_settings_tab(self, configurator):
        settings_page = SettingsPage(configurator)
        widgets = settings_page.get_widgets()

        self.tree_Settings.setItemDelegate(KeyEditableDelegate())

        for key in widgets:
            data = widgets[key]
            value = data["value"]
            if value is not None:
                item_type = type(value)
                item = CustomQTreeWidgetItem([key, value], internal_key=data["key"], item_type=item_type)
                if item_type == bool:
                    item.setCheckState(1, QtCore.Qt.Checked if data["value"] else QtCore.Qt.Unchecked)
                elif item_type == str:
                    item.setText(1, value)
                    item.setFlags(item.flags() | QtCore.Qt.ItemIsEditable)
                self.tree_Settings.addTopLevelItem(item)

        def callback_item_change(item_itself: CustomQTreeWidgetItem, column: int):
            # Less performance because widgets is a hashmap and we find function pointer
            # everytime when calling the function (Updating property).
            callback_function = widgets[item_itself.text(0)]["action"]
            if item_itself.item_type == str:
                callback_function(item_itself.get_internal_key(), item_itself.text(1))
            elif item_itself.item_type == bool:
                callback_function(item_itself.get_internal_key(),
                                  True if item_itself.checkState(column) == QtCore.Qt.Checked else False)

        self.tree_Settings.itemChanged.connect(callback_item_change)

    def hide_window(self):
        self.hide()

    def unhide_window(self):
        self.show()


def start_gui(conf: Configurator, window_manager: WindowManager = None):
    app = QtWidgets.QApplication([])
    app.setWindowIcon(QIcon('static/images/icon.png'))
    window = MainWindow(conf)
    if window_manager:
        window_manager.set_window_handler(window)
    window.show()
    sys.exit(app.exec())
