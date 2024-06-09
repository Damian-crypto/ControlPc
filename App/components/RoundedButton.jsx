import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useFonts, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { LinearGradient } from "expo-linear-gradient";

const RoundedButton = ({
    label,
    onTouch,
    width = 200,
    height = 50,
    fontSize = 24,
}) => {
    let [fontsLoaded, fontError] = useFonts({
        Inter_600SemiBold,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <View style={[styles.btnStyle, styles.btnArea, {
            width: width,
            height: height,
        }]}>
            {/* In below code onPress only activated when clicked on the text,
                but the entire button should be clickable */}
            <TouchableOpacity style={[styles.btnArea, {
                width: width,
                height: height,
            }]} onPress={onTouch}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={['#fc8c79', '#ff7777', '#ff5c75']}
                    style={[styles.btnArea, {
                        width: width,
                        height: height,
                    }]}
                >
                    <Text style={[styles.lblStyle, { fontSize: fontSize, }]}>
                        {label}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    btnArea: {
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnStyle: {
        // backgroundColor: '#AD00FF',
    },
    lblStyle: {
        color: '#fff',
        fontFamily: 'Inter_600SemiBold'
    },
});

export default RoundedButton;
