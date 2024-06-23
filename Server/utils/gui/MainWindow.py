# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'mainwindow.ui'
##
## Created by: Qt User Interface Compiler version 6.7.2
##
## WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PySide6.QtCore import (QCoreApplication, QDate, QDateTime, QLocale,
    QMetaObject, QObject, QPoint, QRect,
    QSize, QTime, QUrl, Qt)
from PySide6.QtGui import (QBrush, QColor, QConicalGradient, QCursor,
    QFont, QFontDatabase, QGradient, QIcon,
    QImage, QKeySequence, QLinearGradient, QPainter,
    QPalette, QPixmap, QRadialGradient, QTransform)
from PySide6.QtWidgets import (QApplication, QHBoxLayout, QHeaderView, QLabel,
    QMainWindow, QMenuBar, QSizePolicy, QSpacerItem,
    QStatusBar, QTabWidget, QTreeWidget, QTreeWidgetItem,
    QVBoxLayout, QWidget)

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        if not MainWindow.objectName():
            MainWindow.setObjectName(u"MainWindow")
        MainWindow.resize(578, 480)
        self.centralwidget = QWidget(MainWindow)
        self.centralwidget.setObjectName(u"centralwidget")
        self.horizontalLayout = QHBoxLayout(self.centralwidget)
        self.horizontalLayout.setObjectName(u"horizontalLayout")
        self.tabWidget = QTabWidget(self.centralwidget)
        self.tabWidget.setObjectName(u"tabWidget")
        self.tabWidget.setTabPosition(QTabWidget.TabPosition.West)
        self.tabWidget.setDocumentMode(False)
        self.tabWidget.setMovable(True)
        self.tab_Home = QWidget()
        self.tab_Home.setObjectName(u"tab_Home")
        self.verticalLayout_2 = QVBoxLayout(self.tab_Home)
        self.verticalLayout_2.setObjectName(u"verticalLayout_2")
        self.horizontalLayout_2 = QHBoxLayout()
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.label = QLabel(self.tab_Home)
        self.label.setObjectName(u"label")
        self.label.setAlignment(Qt.AlignmentFlag.AlignRight|Qt.AlignmentFlag.AlignTrailing|Qt.AlignmentFlag.AlignVCenter)

        self.horizontalLayout_2.addWidget(self.label)

        self.lbl_ServerAddress = QLabel(self.tab_Home)
        self.lbl_ServerAddress.setObjectName(u"lbl_ServerAddress")
        font = QFont()
        font.setPointSize(14)
        self.lbl_ServerAddress.setFont(font)

        self.horizontalLayout_2.addWidget(self.lbl_ServerAddress)


        self.verticalLayout_2.addLayout(self.horizontalLayout_2)

        self.horizontalLayout_3 = QHBoxLayout()
        self.horizontalLayout_3.setObjectName(u"horizontalLayout_3")
        self.label_3 = QLabel(self.tab_Home)
        self.label_3.setObjectName(u"label_3")
        self.label_3.setAlignment(Qt.AlignmentFlag.AlignRight|Qt.AlignmentFlag.AlignTrailing|Qt.AlignmentFlag.AlignVCenter)

        self.horizontalLayout_3.addWidget(self.label_3)

        self.lbl_ServerPort = QLabel(self.tab_Home)
        self.lbl_ServerPort.setObjectName(u"lbl_ServerPort")
        self.lbl_ServerPort.setFont(font)

        self.horizontalLayout_3.addWidget(self.lbl_ServerPort)


        self.verticalLayout_2.addLayout(self.horizontalLayout_3)

        self.horizontalLayout_4 = QHBoxLayout()
        self.horizontalLayout_4.setObjectName(u"horizontalLayout_4")
        self.label_6 = QLabel(self.tab_Home)
        self.label_6.setObjectName(u"label_6")
        self.label_6.setAlignment(Qt.AlignmentFlag.AlignRight|Qt.AlignmentFlag.AlignTrailing|Qt.AlignmentFlag.AlignVCenter)

        self.horizontalLayout_4.addWidget(self.label_6)

        self.lbl_Secret = QLabel(self.tab_Home)
        self.lbl_Secret.setObjectName(u"lbl_Secret")
        self.lbl_Secret.setFont(font)

        self.horizontalLayout_4.addWidget(self.lbl_Secret)


        self.verticalLayout_2.addLayout(self.horizontalLayout_4)

        self.lbl_Image = QLabel(self.tab_Home)
        self.lbl_Image.setObjectName(u"lbl_Image")
        self.lbl_Image.setAutoFillBackground(False)
        self.lbl_Image.setAlignment(Qt.AlignmentFlag.AlignCenter)

        self.verticalLayout_2.addWidget(self.lbl_Image)

        self.verticalSpacer = QSpacerItem(20, 40, QSizePolicy.Policy.Minimum, QSizePolicy.Policy.Expanding)

        self.verticalLayout_2.addItem(self.verticalSpacer)

        self.tabWidget.addTab(self.tab_Home, "")
        self.tab_Settings = QWidget()
        self.tab_Settings.setObjectName(u"tab_Settings")
        self.verticalLayout = QVBoxLayout(self.tab_Settings)
        self.verticalLayout.setObjectName(u"verticalLayout")
        self.tree_Settings = QTreeWidget(self.tab_Settings)
        self.tree_Settings.setObjectName(u"tree_Settings")

        self.verticalLayout.addWidget(self.tree_Settings)

        self.tabWidget.addTab(self.tab_Settings, "")

        self.horizontalLayout.addWidget(self.tabWidget)

        MainWindow.setCentralWidget(self.centralwidget)
        self.menubar = QMenuBar(MainWindow)
        self.menubar.setObjectName(u"menubar")
        self.menubar.setGeometry(QRect(0, 0, 578, 33))
        MainWindow.setMenuBar(self.menubar)
        self.statusbar = QStatusBar(MainWindow)
        self.statusbar.setObjectName(u"statusbar")
        MainWindow.setStatusBar(self.statusbar)

        self.retranslateUi(MainWindow)

        self.tabWidget.setCurrentIndex(0)


        QMetaObject.connectSlotsByName(MainWindow)
    # setupUi

    def retranslateUi(self, MainWindow):
        MainWindow.setWindowTitle(QCoreApplication.translate("MainWindow", u"MainWindow", None))
        self.label.setText(QCoreApplication.translate("MainWindow", u"Host Address (IPv4):", None))
        self.lbl_ServerAddress.setText(QCoreApplication.translate("MainWindow", u"255.255.255.255", None))
        self.label_3.setText(QCoreApplication.translate("MainWindow", u"Host Port:", None))
        self.lbl_ServerPort.setText(QCoreApplication.translate("MainWindow", u"8000", None))
        self.label_6.setText(QCoreApplication.translate("MainWindow", u"Secret Key:", None))
        self.lbl_Secret.setText(QCoreApplication.translate("MainWindow", u"terces", None))
        self.lbl_Image.setText(QCoreApplication.translate("MainWindow", u"Image Label", None))
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.tab_Home), QCoreApplication.translate("MainWindow", u"Home", None))
        ___qtreewidgetitem = self.tree_Settings.headerItem()
        ___qtreewidgetitem.setText(1, QCoreApplication.translate("MainWindow", u"Value", None));
        ___qtreewidgetitem.setText(0, QCoreApplication.translate("MainWindow", u"Property", None));
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.tab_Settings), QCoreApplication.translate("MainWindow", u"Settings", None))
    # retranslateUi

