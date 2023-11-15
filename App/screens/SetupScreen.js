import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Modal,
    ActivityIndicator
} from "react-native";
// import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RoundedButton from "../components/Button";
import ClickableImage from "../components/ClickableImage";

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

const qrImg = require('../assets/images/QR.png');

const SetupScreen = ({ navigation }) => {
    const [mainIPAddr, setMainIPAddr] = useState("192.168.1.100");
    const [fromIpAddr, setFromIpAddr] = useState("192.168.1.100");
    const [toIpAddr, setToIpAddr] = useState("192.168.1.160");
    const [identity, setIdentity] = useState("");
    const [port, setPort] = useState("5000");
    const [baseUrl, setBaseURL] = useState(`http://${mainIPAddr}:${port}`);
    const [showIPRangeModal, setShowIPRangeModal] = useState(false);
    const [scanningIPs, setScanningIPs] = useState(false);

    function reasignBaseURL(newipaddr, newport) {
        setBaseURL(`http://${newipaddr}:${newport}`);
    }

    async function handleConnect() {
        await fetch(`${baseUrl}/connect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uuid: identity,
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Invalid request! ${response.json()["message"]}`);
                }
                return response.text();
            })
            .then(data => {
                navigation.navigate("Dashboard", { baseUrl: baseUrl, uuid: identity });
            })
            .catch((error) => {
                alert(`Connection failed[❌]: ${error}`);
            });
    }

    async function handleTest() {
        await fetch(`${baseUrl}/`, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain'
            }
        })
            .then((response) => {
                if (!response.ok) {
                    alert(`Connection failed[❌] invalid request!: ${error}`);
                    throw new Error('Received request is not ok!');
                }
                return response.text();
            })
            .then(data => {
                alert(`Test ok[✅]: ${data}`);
            })
            .catch((error) => {
                alert(`Test failed[❌]: ${error}`);
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

                        <InputField
                            label={"IP Address (static):"}
                            placeholder={"192.168.1.200"}
                            value={mainIPAddr}
                            onChange={setMainIPAddr}
                        />

                        <RoundedButton
                            label={"Scan"}
                            onTouch={() => setShowIPRangeModal(true)}
                        />

                        <InputField
                            label={"Port:"}
                            placeholder={"5000"}
                            onTouch={setPort}
                        />
                    </View>

                    <View style={[styles.roundedContainer, { flexDirection: 'row' }]}>
                        <InputField
                            label={"Identity:"}
                            placeholder={"fghDhf3492t"}
                            flexGrow={0.8}
                            onChange={txt => setIdentity(txt)}
                        />
                        <ClickableImage
                            style={{ top: 50 }}
                            image={qrImg}
                            onTouch={() => alert("Scanning QR")}
                        />
                    </View>

                    <View style={styles.btnContainer}>
                        <RoundedButton
                            label={"Connect"}
                            onTouch={handleConnect} />
                        <RoundedButton
                            label={"Test"}
                            onTouch={handleTest} />
                        <RoundedButton
                            label={"Cancel"}
                            onTouch={() => navigation.navigate("Welcome")} />
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
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 10,
    }
});

export default SetupScreen;
