import { useContext } from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    ImageBackground,
    SafeAreaView
} from "react-native";
import { StatusBar } from "expo-status-bar";

import ThemeContext from "../context/ThemeContext";

const imgLogo = require('../assets/app/icon.png');

const InformationScreen = () => {
    const themeContext = useContext(ThemeContext);

    return (
        <ImageBackground
            style={styles.backgroundImage}
            source={themeContext.bgImage}
            blurRadius={themeContext.blurRadius}
        >
            <SafeAreaView style={styles.subContainer}>
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
                    flexDirection: 'column',
                    alignItems: 'center',
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
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        // borderWidth: 1,
        // borderColor: 'red',
    },
    subContainer: {
        flex: 1,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default InformationScreen;
