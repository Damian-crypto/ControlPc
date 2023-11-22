import { View, Text, StyleSheet, Image } from "react-native";
import RoundedButton from "../components/RoundedButton";
import { SafeAreaView } from "react-native-safe-area-context";

const logoImg = require('../assets/app/icon.png');

const WelcomeScreen = ({navigation}) => {
    return (
        <View style={styles.backgroundView}>
            <SafeAreaView style={styles.subcontainer}>
                <Image style={styles.logoContainer} source={logoImg} />
                <Text style={{
                    color: '#fff',
                    fontSize: 36,
                    fontWeight: 'bold',
                }}>
                    ControlPc
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
    },
    logoContainer: {
        width: 200,
        height: 200,
        margin: 10,
    }
});

export default WelcomeScreen;
