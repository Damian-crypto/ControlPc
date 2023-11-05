import { View, Text, StyleSheet } from "react-native";
import { ImageBackground } from "react-native";
import RoundedButton from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

const imgBg = require('../assets/images/bg.png');

const WelcomeScreen = ({navigation}) => {
    return (
        <View style={styles.backgroundView}>
            <SafeAreaView style={styles.subcontainer}>
                <Text style={{
                    color: '#fff',
                    fontSize: 36,
                    fontWeight: 'bold',
                }}>
                    Welcome
                </Text>
                <Text style={{
                    color: '#fff',
                    fontSize: 36,
                    fontWeight: 'bold',
                }}>
                    To ControlPc
                </Text>

                <View style={styles.btnContinue}>
                    <RoundedButton
                        label={"Continue"}
                        onTouch={() => navigation.navigate("Setup") }/>
                </View>
            </SafeAreaView>
        </View>
    )
};

const styles = StyleSheet.create({
    backgroundView: {
        flex: 1,
        backgroundColor: 'black',
    },
    subcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnContinue: {
        top: 100,
    }
});

export default WelcomeScreen;
