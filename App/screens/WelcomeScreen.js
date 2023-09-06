import { View, Text, StyleSheet } from "react-native";
import { ImageBackground } from "react-native";
import RoundedButton from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

const imgBg = require('../assets/images/bg.png');

const WelcomeScreen = ({navigation}) => {
    return (
        <ImageBackground
            source={imgBg}
            resizeMode="cover"
            style={styles.imagedBg}
        >
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
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    imagedBg: {
        flex: 1,
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
