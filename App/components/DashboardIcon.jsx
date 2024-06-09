import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Image
} from "react-native";

import IconComponent from "./IconComponent";

const DashboardIcon = ({
    label,
    icon,
    onTouch,
    width = 100,
    height = 100,
    iconSize = width * 3 / 4,
    borderWidth = 2
}) => {

    return (
        <View style={[styles.btnContainer, {
            width: width + 20,
            height: height + 50
        }]}>
            <View style={[styles.btnStyle, {
                width: width,
                height: height,
            }]}>
                <TouchableOpacity style={[styles.btnArea, {
                    borderWidth: borderWidth,
                }]} onPress={onTouch}>
                    {
                        typeof icon !== 'string'
                            ?
                            <Image source={icon} />
                            :
                            <IconComponent icon={icon} size={iconSize} color="#FFF" />
                    }
                </TouchableOpacity>
            </View>
            <Text style={styles.lblStyle}>{label}</Text>
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
        padding: 10,
        borderRadius: 20,
        borderColor: '#55555550',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000050'
    },
    btnStyle: {
        borderColor: '#fff',
        backgroundColor: '#00000000',
    },
    lblStyle: {
        color: '#fff',
        fontSize: 16,
    },
});

export default DashboardIcon;
