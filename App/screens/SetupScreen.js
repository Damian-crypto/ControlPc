import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, ScrollView, StatusBar } from "react-native";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RoundedButton from "../components/Button";
import ClickableImage from "../components/ClickableImage";

const imgBg = require('../assets/images/bg.png');
const qrImg = require('../assets/images/QR.png');

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

const SetupScreen = ({ navigation }) => {
    const [fromIpAddr, setFromIpAddr] = useState("");
    const [toIpAddr, setToIpAddr] = useState("");
    const [identity, setIdentity] = useState("");
    const [baseUrl, setBaseUrl] = useState("http://192.168.1.101:5000");

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

    return (
        <ScrollView>
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

                        <InputField
                            label={"From:"}
                            placeholder={"192.168.1.100"}
                            value={fromIpAddr}
                            onChange={setFromIpAddr}
                        />

                        <InputField
                            label={"To:"}
                            placeholder={"192.168.1.200"}
                            value={toIpAddr}
                            onChange={setToIpAddr}
                        />

                        <InputField
                            label={"Port:"}
                            placeholder={"5000"}
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
            <StatusBar style="auto"/>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
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
