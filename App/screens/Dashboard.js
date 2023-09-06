import { View, Text, StyleSheet, TextInput } from "react-native";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardIcon from "../components/Icon";

const imgBg = require('../assets/images/bg.png');
const imgPower = require('../assets/images/power.png');
const imgCam = require('../assets/images/camera.png');
const imgRun = require('../assets/images/zap.png');

const Dashboard = ({navigation, baseURL}) => {
    function handlePower() {
        fetch(`${baseURL}/power`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'Damian' })
        })
        .then((response) => response.json())
        .then((data) => {
            alert(data);
        })
        .catch((error) => {
            alert(error);
        });
    }

    return(
        <ImageBackground
            source={imgBg}
            resizeMode="cover"
            style={styles.imagedBg}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.btnRow}>
                    <DashboardIcon
                        // label={"Power"}
                        icon={imgPower}
                        onTouch={handlePower}
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
