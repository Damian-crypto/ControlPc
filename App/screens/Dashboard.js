import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardIcon from "../components/DashboardIcon";
import { useState } from "react";

const imgBg = require('../assets/images/bg.png');
const imgPower = require('../assets/images/power.png');
const imgSleep = require('../assets/images/sleep.png');
const imgRestart = require('../assets/images/restart.png');
const imgCam = require('../assets/images/camera.png');
const imgRun = require('../assets/images/zap.png');

const Dashboard = ({navigation, route}) => {
    const { baseUrl, uuid } = route.params;
    const [ powerModalVisible, setPowerModalVisible ] = useState(false);

    async function handlePower(cmd) {
        fetch(`${baseUrl}/command`, {
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
        <ImageBackground
            source={imgBg}
            resizeMode="cover"
            style={styles.imagedBg}
        >
            <SafeAreaView style={styles.container}>
                <Text style={{ left: 10, color: '#fff' }}>Connected to: {baseUrl}</Text>
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

                <View style={styles.btnRow}>
                    <DashboardIcon
                        // label={"Power"}
                        icon={imgPower}
                        onTouch={() => setPowerModalVisible(true)}
                    />
                    <DashboardIcon
                        // label={"Screenshot"}
                        icon={imgCam}
                    />
                    <DashboardIcon
                        // label={"Run"}
                        icon={imgRun}
                    />
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
    container: {
        flex: 1,
        backgroundColor: '#ffffff50',
    },
    btnRow: {
        flexDirection: 'row',
    }
});

export default Dashboard;
