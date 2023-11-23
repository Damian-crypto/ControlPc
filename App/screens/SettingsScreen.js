import React, { useState, useEffect } from "react";
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
} from "react-native";
import Checkbox from "expo-checkbox";
// import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RoundedButton from "../components/RoundedButton";
import ClickableImage from "../components/ClickableImage";

import QRScannerModal from "../components/QRScannerModal";

const InputField = ({ label, placeholder, value, onChange, flexGrow }) => {
    return (
        <View style={{
            padding: 10,
            flexGrow: flexGrow
        }}>
            <Text
                style={{
                    fontSize: 20,
                }}
            >
                {label}
            </Text>
            <TextInput
                style={{
                    borderBottomWidth: 5,
                    fontSize: 24,
                }}

                placeholder={placeholder}

                value={value}

                onChangeText={onChange}
            />
        </View>
    )
};

const qrImg = require('../assets/images/qr.png');

const SettingsScreen = ({ navigation, route }) => {
    const { baseURL, uuid } = route.params;
    const [mainIPAddr, setMainIPAddr] = useState("192.168.1.100");
    const [fromIpAddr, setFromIpAddr] = useState("192.168.1.100");
    const [toIpAddr, setToIpAddr] = useState("192.168.1.160");
    const [identity, setIdentity] = useState(uuid);
    const [port, setPort] = useState("5000");
    // const [baseURL, setBaseURL] = useState(`http://${mainIPAddr}:${port}`);
    const [showIPRangeModal, setShowIPRangeModal] = useState(false);
    const [scanningIPs, setScanningIPs] = useState(false);
    const [serverVisible, setServerVisible] = useState(true);
    const [showQRScannerModel, setShowQRScannerModel] = useState(false);

    function reasignBaseURL(newipaddr, newport) {
        setBaseURL(`http://${newipaddr}:${newport}`);
    }

    useEffect(() => {
        const pattern = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\:\d{1,4}/g;
        const match = pattern.exec(baseURL);
        const urlParts = match[0].split(':');

        setMainIPAddr(urlParts[0]);
        setPort(urlParts[1]);
    }, []);

    async function handleSave() {
        await fetch(`${baseURL}/configured`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uuid: identity,
            })
        })
            .then((response) => {})
            .catch((error) => {
                alert(`Not configured due to loss of connection to the server!`);
            });
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
                            }).catch((error) => {});
                        }
                    }
                }
            }

            if (!found) {
                reject(mainIPAddr);
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
                uuid: identity,
                command: cmd,
            })
        })
            .then((response) => {})
            .catch((error) => {
                alert(`Not configured due to loss of connection to the server!`);
            });
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.backgroundView}>
                <SafeAreaView>
                    <View style={styles.roundedContainer}>
                        <Text
                            style={{
                                fontSize: 28,
                            }}
                        >
                            IPv4 Range:
                        </Text>

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
                                            />

                                            <InputField
                                                label={"To:"}
                                                placeholder={"192.168.1.254"}
                                                value={toIpAddr}
                                                onChange={setToIpAddr}
                                            />

                                            <RoundedButton
                                                label={"Start Scan"}
                                                onTouch={async () => {
                                                    setScanningIPs(true);
                                                    await scanIPs(fromIpAddr, toIpAddr)
                                                        .then((ip) => {
                                                            setMainIPAddr(ip);
                                                            reasignBaseURL(ip, port);
                                                            setScanningIPs(false);
                                                            setShowIPRangeModal(false);
                                                        })
                                                        .catch((ip) => {});
                                                }}
                                            />
                                        </View>
                                }
                            </TouchableOpacity>
                        </Modal>

                        <QRScannerModal
                            visible={showQRScannerModel}
                            setVisible={setShowQRScannerModel}
                            setIdentity={setIdentity}
                        />

                        <InputField
                            label={"IP Address (static):"}
                            placeholder={"192.168.1.200"}
                            value={mainIPAddr}
                            onChange={setMainIPAddr}
                        />

                        <RoundedButton
                            label={"Scan"}
                            width={130}
                            fontSize={16}
                            onTouch={() => setShowIPRangeModal(true)}
                        />

                        <InputField
                            label={"Port:"}
                            placeholder={"5000"}
                            value={port}
                            onTouch={setPort}
                        />
                    </View>

                    <View style={[styles.roundedContainer, { flexDirection: 'row' }]}>
                        <InputField
                            label={"Identity:"}
                            placeholder={"fghDhf3492t"}
                            value={identity}
                            flexGrow={0.8}
                            onChange={txt => setIdentity(txt)}
                        />
                        <ClickableImage
                            style={{ top: 50 }}
                            image={qrImg}
                            onTouch={() => setShowQRScannerModel(true)}
                        />
                    </View>

                    <View style={[styles.roundedContainer, {
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                    }]}>
                        <Text style={{
                            fontSize: 20,
                        }}>Server is visible</Text>
                        <Checkbox
                            value={serverVisible}
                            onValueChange={handleServerVisibility}
                            color={serverVisible ? 'purple' : undefined }
                        />
                    </View>

                    <View style={styles.btnContainer}>
                        <RoundedButton
                            label={"Cancel"}
                            width={130}
                            fontSize={16}
                            onTouch={() => navigation.navigate("Dashboard", { baseURL: baseURL, uuid: identity })} />
                        <RoundedButton
                            label={"Save"}
                            width={130}
                            fontSize={16}
                            onTouch={handleSave} />
                    </View>
                </SafeAreaView>
            </View>
            <StatusBar style="auto" />
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
    },
    backgroundView: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#000',
    },
    roundedContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    btnContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    }
});

export default SettingsScreen;
