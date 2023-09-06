import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

const RoundedButton = ({
    label,
    onTouch,
    width = 200,
    height = 50,
    }) => {
    return (
        <View style={[styles.btnStyle, styles.btnArea, {
            width: width,
            height: height,
        }]}>
            <TouchableOpacity style={styles.btnArea} onPress={onTouch}>
                <Text style={styles.lblStyle}>{ label }</Text>
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
        backgroundColor: '#AD00FF',
    },
    lblStyle: {
        color: '#fff',
        fontSize: 24,
    },
});

export default RoundedButton;
