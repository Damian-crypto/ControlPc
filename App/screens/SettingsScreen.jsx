import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Modal,
    ActivityIndicator,
    ImageBackground,
    Dimensions
} from "react-native";
import Checkbox from "expo-checkbox";
import { SafeAreaView } from "react-native-safe-area-context";

import RoundedButton from "../components/RoundedButton";
import ClickableImage from "../components/ClickableImage";
import InputField from "../components/InputField";

import QRScannerModal from "../components/QRScannerModal";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

const SettingsScreen = ({ navigation, route }) => {
    const authContext = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);

    const
        _mainIP = authContext['mainIP'],
        _port = authContext['port'],
        _identity = authContext['identity'];
    const [mainIPAddress, _setMainIPAddress] = useState(_mainIP);
    const [port, _setPort] = useState(_port);
    const [uuid, _setUUID] = useState(_identity);
    const [fromIpAddr, setFromIpAddr] = useState("192.168.1.100");
    const [toIpAddr, setToIpAddr] = useState("192.168.1.160");
    const [baseURL, setBaseURL] = useState(authContext.getBaseURL());
    const [showIPRangeModal, setShowIPRangeModal] = useState(false);
    const [scanningIPs, setScanningIPs] = useState(false);
    const [serverVisible, setServerVisible] = useState(true);
    const [showQRScannerModel, setShowQRScannerModel] = useState(false);

    useEffect(() => setBaseURL(`http://${mainIPAddress}:${port}`), [mainIPAddress, port]);

    const setMainIPAddress = (ip) => {
        authContext['mainIP'] = ip;
        _setMainIPAddress(ip);
    };

    const setPort = (port) => {
        authContext['port'] = port;
        _setPort(port);
    };

    const setUUID = (identity) => {
        authContext['identity'] = identity;
        _setUUID(identity);
    };

    useEffect(() => {
        const pattern = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\:\d{1,4}/g;
        const match = pattern.exec(baseURL);
        const urlParts = match[0].split(':');

        setMainIPAddress(urlParts[0]);
        setPort(urlParts[1]);
    }, []);

    function handleSave() {
        navigation.navigate('Dashboard');
    }

    function scanIPs(start, end) {
        return new Promise(async (resolve, reject) => {
            let startOctets = start.split('.').map((x) => parseInt(x));
            let endOctets = end.split('.').map((x) => parseInt(x));
            let found = false; // found an IP address or not

            for (let a = startOctets[0]; a <= endOctets[0] && !found; a++) {
                for (let b = startOctets[1]; b <= endOctets[1] && !found; b++) {
                    for (let c = startOctets[2]; c <= endOctets[2] && !found; c++) {
                        for (let d = startOctets[3]; d <= endOctets[3] && !found; d++) {
                            let ip = `${a}.${b}.${c}.${d}`;
                            await fetch(`http://${ip}:${port}/`, {
                                method: 'GET',
                                headers: {
                                    'Accept': 'text/plain'
                                }
                            })
                                .then((response) => {
                                    found = true;
                                    resolve(ip);
                                    alert(`Found listening IP: ${ip}`);
                                }).catch((error) => { });
                        }
                    }
                }
            }

            if (!found) {
                reject(mainIPAddress);
            }
        });
    }

    function handleServerVisibility(visible) {
        setServerVisible(visible);
        let cmd = 'window_';
        if (visible === true) {
            cmd += 'unhide';
        } else {
            cmd += 'hide';
        }

        fetch(`${baseURL}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uuid: uuid,
                command: cmd,
            })
        })
            .then((response) => { })
            .catch((error) => {
                alert(`Not configured due to loss of connection to the server!`);
            });
    }

    const IPScanner = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={showIPRangeModal}
            >
                <TouchableOpacity style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
                    onPress={() => setShowIPRangeModal(false)}
                >
                    {
                        scanningIPs
                            ?
                            <View>
                                <ActivityIndicator size="large" />
                                <Text>Scanning for IP addresses...</Text>
                            </View>
                            :
                            <View>
                                <Text
                                    style={{
                                        fontSize: 28,
                                    }}
                                >
                                    IP Scanner
                                </Text>

                                <InputField
                                    label={"From:"}
                                    placeholder={"192.168.1.1"}
                                    value={fromIpAddr}
                                    onChange={setFromIpAddr}
                                    fontStyles={styles.modalFonts}
                                />

                                <InputField
                                    label={"To:"}
                                    placeholder={"192.168.1.254"}
                                    value={toIpAddr}
                                    onChange={setToIpAddr}
                                    fontStyles={styles.modalFonts}
                                />

                                <RoundedButton
                                    label={"Start Scan"}
                                    onTouch={async () => {
                                        setScanningIPs(true);
                                        await scanIPs(fromIpAddr, toIpAddr)
                                            .then((ip) => {
                                                setMainIPAddress(ip);
                                                setScanningIPs(false);
                                                setShowIPRangeModal(false);
                                            })
                                            .catch((error) => {
                                                `Address Error: ${error}`
                                            });
                                    }}
                                />
                            </View>
                    }
                </TouchableOpacity>
            </Modal>
        );
    };

    return (
        <ImageBackground
            style={styles.backgroundImage}
            source={themeContext.bgImage}
            blurRadius={themeContext.blurRadius}
        >
            <ScrollView style={styles.scrollViewContainer}>
                <SafeAreaView style={styles.safeAreaViewContainer}>
                    <View style={styles.roundedContainer}>
                        <Text
                            style={[styles.fontStyle, {
                                fontSize: 28,
                            }]}
                        >
                            IPv4 Range:
                        </Text>

                        <IPScanner />

                        <QRScannerModal
                            visible={showQRScannerModel}
                            setVisible={setShowQRScannerModel}
                            setData={(data) => {
                                const [host, port, id] = data.split(' ');
                                setUUID(id);
                                setPort(port);
                                setMainIPAddress(host);
                            }}
                        />

                        <InputField
                            label={"IP Address (static):"}
                            placeholder={"192.168.1.200"}
                            value={mainIPAddress}
                            onChange={setMainIPAddress}
                        />

                        <RoundedButton
                            label={"Scan"}
                            onTouch={() => setShowIPRangeModal(true)}
                        />

                        <InputField
                            label={"Port:"}
                            placeholder={"5000"}
                            value={port}
                            onChange={setPort}
                        />
                    </View>

                    <View style={[styles.roundedContainer, { flexDirection: 'row' }]}>
                        <InputField
                            label={"Identity:"}
                            placeholder={"fghDhf3492t"}
                            value={uuid}
                            flexGrow={0.8}
                            onChange={txt => setUUID(txt)}
                        />
                        <ClickableImage
                            style={{ top: 25, color: '#FFF' }}
                            icon={"qr-code-scanner"}
                            iconSize={50}
                            onTouch={() => setShowQRScannerModel(true)}
                        />
                    </View>

                    <View style={[styles.roundedContainer, {
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                    }]}>
                        <Text style={{
                            color: '#FFF',
                            fontSize: 20,
                        }}>Server is visible</Text>
                        <Checkbox
                            value={serverVisible}
                            onValueChange={handleServerVisibility}
                            color={serverVisible ? 'purple' : undefined}
                        />
                    </View>

                    <View style={styles.btnContainer}>
                        <RoundedButton
                            label={"Cancel"}
                            width={130}
                            fontSize={16}
                            onTouch={() => navigation.navigate("Dashboard", { baseURL: baseURL, uuid: uuid })} />
                        <RoundedButton
                            label={"Save"}
                            width={130}
                            fontSize={16}
                            onTouch={handleSave} />
                    </View>
                </SafeAreaView>
            </ScrollView>
            <StatusBar style="auto" />
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        flex: 1,
        // borderWidth: 1,
        // borderColor: 'yellow',
    },
    backgroundImage: {
        flex: 1,
        // borderWidth: 4,
        // borderColor: 'red',
    },
    safeAreaViewContainer: {
        flex: 1,
        // marginTop: 60,
        // borderWidth: 4,
        // borderColor: 'blue',
    },
    roundedContainer: {
        backgroundColor: '#00000050',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#55555550',
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    btnContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    fontStyle: {
        color: '#fff',
    },
    modalFonts: {
        color: '#000',
    }
});

export default SettingsScreen;
