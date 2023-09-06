import React, {useState} from "react";
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from "react-native";
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

const SetupScreen = ({navigation}) => {
    const [fromIpAddr, setFromIpAddr] = useState("");
    const [toIpAddr, setToIpAddr] = useState("");

    function handleConnect() {
        navigation.navigate("Dashboard");
        alert(fromIpAddr);
    }

    return (
        <ImageBackground
            source={imgBg}
            resizeMode="cover"
            style={styles.imagedBg}
        >
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
                        placeholder={"192.168.1.102"}
                        value={fromIpAddr}
                        onChange={setFromIpAddr}
                    />

                    <InputField
                        label={"To:"}
                        placeholder={"192.168.1.255"}
                        value={toIpAddr}
                        onChange={setToIpAddr}
                    />

                    <InputField
                        label={"Port:"}
                        placeholder={"8089"}
                    />
                </View>

                <View style={[styles.roundedContainer, { flexDirection: 'row' }]}>
                    <InputField
                        label={"Identity:"}
                        placeholder={"fghDhf3492t"}
                        flexGrow={0.8}
                    />
                    <ClickableImage
                        style={{ top: 50 }}
                        image={qrImg}
                        onTouch={ () => alert("Scanning QR") }
                    />
                </View>

                <View style={styles.btnContainer}>
                    <RoundedButton
                        label={"Connect"}
                        onTouch={handleConnect}/>
                    <RoundedButton
                        label={"Cancel"}
                        onTouch={() => navigation.navigate("Welcome") }/>
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    imagedBg: {
        flex: 1,
        justifyContent: 'center',
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
