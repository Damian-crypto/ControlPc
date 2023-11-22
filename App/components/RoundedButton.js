import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

const RoundedButton = ({
    label,
    onTouch,
    width = 200,
    height = 50,
    fontSize = 24,
    }) => {
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
                <Text style={[styles.lblStyle, {
                    fontSize: fontSize,
                }]}>{ label }</Text>
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
    },
});

export default RoundedButton;
