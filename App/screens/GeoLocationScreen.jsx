import { View, Text, StyleSheet, Image } from "react-native";
import RoundedButton from "../components/RoundedButton";
import { SafeAreaView } from "react-native-safe-area-context";
import GeoLocation from "../components/GeoLocation";

const GeoLocationScreen = ({navigation}) => {
    return (
        <View style={styles.backgroundView}>
            <SafeAreaView style={styles.subcontainer}>
                <GeoLocation />
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

export default GeoLocationScreen;
