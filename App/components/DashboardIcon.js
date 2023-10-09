import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Image } from "react-native";

const DashboardIcon = ({
    label,
    icon,
    onTouch,
    width = 100,
    height = 100,
    borderWidth = 0
    }) => {

    return (
        <View style={[styles.btnContainer, {
            width: width + 20,
            height: height + 50
        }]}>
            <View style={[styles.btnStyle, styles.btnArea, {
                width: width,
                height: height,
                borderWidth: borderWidth
            }]}>
                <TouchableOpacity style={styles.btnArea} onPress={onTouch}>
                    <Image source={icon} />
                </TouchableOpacity>
            </View>
            <Text style={styles.lblStyle}>{ label }</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    btnContainer: {
        // borderWidth: 5,
        // borderColor: '#f00',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnArea: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnStyle: {
        borderColor: '#fff',
        backgroundColor: '#000',
    },
    lblStyle: {
        color: '#fff',
        fontSize: 16,
    },
});

export default DashboardIcon;
