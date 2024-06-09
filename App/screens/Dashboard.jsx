import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, StatusBar, ImageBackground, ScrollView } from "react-native";
// import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardIcon from "../components/DashboardIcon";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

import ClickableImage from "../components/ClickableImage";
import ThemeContext from "../context/ThemeContext";

const imgLogo = require('../assets/app/icon.png');

const Dashboard = ({ navigation, route }) => {
    const authContext = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);
    const [powerModalVisible, setPowerModalVisible] = useState(false);
    const [aboutModalVisible, setAboutModalVisible] = useState(false);

    const baseURL = authContext.getBaseURL();

    async function handlePower(cmd) {
        fetch(`${baseURL}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: authContext['identity'],
                command: cmd
            })
        })
            .then((response) => response.json())
            .then((data) => {
                alert(`Power data received: ${data['message']}`);
            })
            .catch((error) => {
                alert(`Error occurred with power: ${error}`);
            });
    }

    const Container = () => {
        return (
            <SafeAreaView style={styles.safeAreaViewContainer}>
                <Text style={{ left: 10, color: '#fff' }}>Connected to: {baseURL}</Text>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={powerModalVisible}
                >
                    <TouchableOpacity style={{
                        flex: 1,
                        backgroundColor: '#000000cc',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                        onPress={() => setPowerModalVisible(false)}
                    >
                        <DashboardIcon
                            // label={"Screenshot"}
                            icon={"power"}
                            onTouch={() => handlePower('shutdown')}
                        />
                        <DashboardIcon
                            // label={"Sleep"}
                            icon={"moon-outline"}
                            onTouch={() => handlePower('sleep')}
                        />
                        <DashboardIcon
                            // label={"Sleep"}
                            icon={"refresh"}
                            onTouch={() => handlePower('restart')}
                        />
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={aboutModalVisible}
                >
                    <TouchableOpacity style={{
                        flex: 1,
                        backgroundColor: '#000000cc',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                        onPress={() => setAboutModalVisible(false)}
                    >
                        <Image
                            source={imgLogo}
                            style={{
                                width: 200,
                                height: 200,
                                margin: 10,
                            }}
                        />
                        <Text style={{
                            fontSize: 36,
                            color: '#fff',
                        }}>ControlPc</Text>
                        <Text style={{
                            fontSize: 20,
                            color: '#fff',
                        }}>Developed by ZEUS</Text>
                        <View style={{
                            flexDirection: 'row',
                            gap: 10,
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#fff',
                            }}>Contact Developer:</Text>
                            <Text style={{
                                fontSize: 16,
                                color: '#0f0',
                                fontStyle: 'italic',
                            }}>bdamianchamel@gmail.com</Text>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <View style={styles.btnRow}>
                    <DashboardIcon
                        // label={"Power"}
                        icon={"power"}
                        onTouch={() => setPowerModalVisible(true)}
                    />
                    <DashboardIcon
                        // label={"Screenshot"}
                        icon={"camera"}
                        onTouch={() => navigation.navigate("Live Screen")}
                    />
                    <DashboardIcon
                        // label={"Run"}
                        icon={"terminal"}
                        onTouch={() => navigation.navigate("Terminal")}
                    />
                </View>

                <View style={styles.btnRow}>
                    <DashboardIcon
                        // label={"Power"}
                        icon={"settings"}
                        onTouch={() => navigation.navigate("Settings")}
                    />
                    <DashboardIcon
                        // label={"Screenshot"}
                        icon={"codesandbox"}
                        onTouch={() => { }}
                    />
                    <DashboardIcon
                        // label={"Run"}
                        icon={"info"}
                        onTouch={() => setAboutModalVisible(true)}
                    />
                </View>

                <View style={styles.btnRow}>
                    <DashboardIcon
                        // label={"Geo"}
                        icon={"map-pin"}
                        onTouch={() => navigation.navigate("Geo Location")}
                    />
                </View>
            </SafeAreaView>
        );
    };

    return (
        <ImageBackground
            style={styles.backgroundImage}
            source={themeContext.bgImage}
            blurRadius={themeContext.blurRadius}
        >
            <ScrollView style={styles.backgroundView}>
                <Container />
            </ScrollView>
            <StatusBar style={"dark"} />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        // borderColor: 'yellow',
        // borderWidth: 1,
    },
    backgroundView: {
        flex: 1,
        // borderColor: 'blue',
        // borderWidth: 1,
    },
    safeAreaViewContainer: {
        flex: 1,
        marginTop: 60,
        // borderColor: 'red',
        // borderWidth: 1,
    },
    btnRow: {
        flexDirection: 'row',
    },
});

export default Dashboard;
