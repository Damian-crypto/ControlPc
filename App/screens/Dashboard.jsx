
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
    ImageBackground,
    ScrollView
} from "react-native";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import DashboardIcon from "../components/DashboardIcon";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";
import { StatusBar } from "expo-status-bar";

const imgLogo = require('../assets/app/icon.png');

const Dashboard = ({ navigation, route }) => {
    const authContext = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);
    const [powerModalVisible, setPowerModalVisible] = useState(false);

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

    const PowerMenuModal = ({ visible, setVisible }) => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
            >
                <TouchableOpacity style={{
                    flex: 1,
                    backgroundColor: '#000000cc',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
                    onPress={setVisible}
                >
                    <DashboardIcon
                        // label={"Screenshot"}
                        icon={"power"}
                        onTouch={() => powerMenuActions('shutdown')}
                    />
                    <DashboardIcon
                        // label={"Sleep"}
                        icon={"moon-outline"}
                        onTouch={() => powerMenuActions('sleep')}
                    />
                    <DashboardIcon
                        // label={"Sleep"}
                        icon={"refresh"}
                        onTouch={() => powerMenuActions('restart')}
                    />
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
            <ScrollView style={styles.backgroundView}>
                <SafeAreaView style={styles.safeAreaViewContainer}>
                    <PowerMenuModal
                        visible={powerModalVisible}
                        setVisible={setPowerModalVisible}
                        powerMenuActions={handlePower}
                    />

                    <View style={styles.btnRow}>
                        <DashboardIcon
                            label={"Power"}
                            icon={"settings-power"}
                            onTouch={() => setPowerModalVisible(true)}
                        />
                        <DashboardIcon
                            label={"Live Cam"}
                            icon={"camera"}
                            onTouch={() => navigation.navigate("Live Screen")}
                        />
                        <DashboardIcon
                            label={"Run"}
                            icon={"terminal"}
                            onTouch={() => navigation.navigate("Terminal")}
                        />
                    </View>

                    <View style={styles.btnRow}>
                        <DashboardIcon
                            label={"Plugins"}
                            icon={"codesandbox"}
                            onTouch={() => { navigation.navigate("Plugins Manager") }}
                        />
                        <DashboardIcon
                            label={"Location"}
                            icon={"map-pin"}
                            onTouch={() => navigation.navigate("Geo Location")}
                        />
                        <DashboardIcon
                            label={"Processes"}
                            icon={"tasks"}
                            onTouch={() => navigation.navigate("Process Manager")}
                        />
                    </View>

                </SafeAreaView>
            </ScrollView>
            <StatusBar style="dark" />
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
        // marginTop: 60,
        // borderColor: 'red',
        // borderWidth: 1,
    },
    btnRow: {
        flexDirection: 'row',
    },
});

export default Dashboard;
