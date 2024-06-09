import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import RoundedButton from "../components/RoundedButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import { StatusBar } from "expo-status-bar";

const welcomeImage = require('../assets/images/welcome.png');

const WelcomeScreen = ({ navigation }) => {
    const themeContext = useContext(ThemeContext);

    return (
        <View style={styles.backgroundView}>
            <ImageBackground
                style={styles.backgroundImage}
                source={themeContext.bgImage}
                blurRadius={themeContext.blurRadius}
            >
                <Image style={styles.welcomeImage} source={welcomeImage} />

                <View style={{
                    // borderWidth: 1,
                    // borderColor: 'red',
                }}>
                    <MaskedView
                        style={styles.maskedView}
                        maskElement={
                            <Text style={styles.welcomeText}>
                                ControlPc
                            </Text>
                        }>
                        <LinearGradient style={styles.maskedView} colors={['black', 'white', 'gray']} />
                    </MaskedView>
                </View>

                <View style={styles.btnContinue}>
                    <RoundedButton
                        label={"Continue"}
                        onTouch={() => navigation.navigate("Setup")} />
                </View>
            </ImageBackground>

            <StatusBar style="light" />
        </View>
    )
};

const styles = StyleSheet.create({
    backgroundView: {
        flex: 1,
        backgroundColor: 'black',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        color: '#fff',
        fontSize: 54,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    btnContinue: {
        top: 10,
    },
    welcomeImage: {
        margin: 10,
        height: 402,
        width: 291,
        resizeMode: 'stretch',
        // borderWidth: 1,
        // borderColor: 'red',
    },
    maskedView: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // flexDirection: 'row',
        padding: 5,
        height: 80,
        width: 350,
    },
    // linearGradient: {
    //     flex: 1,
    //     height: 50,
    //     borderWidth: 1,
    //     borderColor: 'red',
    // },
});

export default WelcomeScreen;
