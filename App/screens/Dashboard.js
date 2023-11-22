import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from "react-native";
// import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardIcon from "../components/DashboardIcon";
import { useState } from "react";

const imgPower = require('../assets/images/power.png');
const imgSleep = require('../assets/images/sleep.png');
const imgRestart = require('../assets/images/restart.png');
const imgCam = require('../assets/images/camera.png');
const imgSettings = require('../assets/images/settings.png');
const imgPlugin = require('../assets/images/box.png');
const imgTerminal = require('../assets/images/terminal.png');
const imgAbout = require('../assets/images/info.png');
const imgLogo = require('../assets/app/icon.png');
// const imgRun = require('../assets/images/zap.png');

const Dashboard = ({navigation, route}) => {
    const { baseURL, uuid } = route.params;
    const [ powerModalVisible, setPowerModalVisible ] = useState(false);
    const [ aboutModalVisible, setAboutModalVisible ] = useState(false);

    async function handlePower(cmd) {
        fetch(`${baseURL}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: uuid,
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

    return(
        <View style={styles.backgroundView}>
            <SafeAreaView style={styles.container}>
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
                            icon={imgPower}
                            onTouch={() => handlePower('shutdown')}
                            borderWidth={2}
                        />
                        <DashboardIcon
                            // label={"Sleep"}
                            icon={imgSleep}
                            onTouch={() => handlePower('sleep')}
                            borderWidth={2}
                        />
                        <DashboardIcon
                            // label={"Sleep"}
                            icon={imgRestart}
                            onTouch={() => handlePower('restart')}
                            borderWidth={2}
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
                            }}>Contact Author:</Text>
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
                        icon={imgPower}
                        onTouch={() => setPowerModalVisible(true)}
                    />
                    <DashboardIcon
                        // label={"Screenshot"}
                        icon={imgCam}
                        onTouch={() => navigation.navigate("Live Screen", { baseURL: baseURL, uuid: uuid })}
                    />
                    <DashboardIcon
                        // label={"Run"}
                        icon={imgTerminal}
                        onTouch={() => navigation.navigate("Terminal", { baseURL: baseURL, uuid: uuid }) }
                    />
                </View>

                <View style={styles.btnRow}>
                    <DashboardIcon
                        // label={"Power"}
                        icon={imgSettings}
                        onTouch={() => navigation.navigate("Settings", { baseURL: baseURL, uuid: uuid })}
                    />
                    <DashboardIcon
                        // label={"Screenshot"}
                        icon={imgPlugin}
                        onTouch={() => {}}
                    />
                    <DashboardIcon
                        // label={"Run"}
                        icon={imgAbout}
                        onTouch={() => setAboutModalVisible(true)}
                    />
                </View>
            </SafeAreaView>
        </View>
    )
};

const styles = StyleSheet.create({
    backgroundView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff50',
    },
    btnRow: {
        flexDirection: 'row',
    }
});

export default Dashboard;
