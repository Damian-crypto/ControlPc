import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";

// TODO: sometimes except material icons, others are not working
const IconComponent = ({icon, style, color="#FFF", size=100}) => {
    const IconSet = {
        'qr-code-scanner': <MaterialIcon style={style} name={icon} size={size} color={color} />,
        // 'codesandbox': <FeatherIcon style={style} name={icon} size={size} color={color} />,
        'codesandbox': <MaterialIcon style={style} name={"archive"} size={size} color={color} />,
        // 'settings': <FeatherIcon style={style} name={icon} size={size} color={color} />,
        'settings': <MaterialCommunityIcon style={style} name={icon} size={size} color={color} />,
        // 'info': <FeatherIcon style={style} name={icon} size={size} color={color} />,
        'info': <MaterialCommunityIcon style={style} name={icon} size={size} color={color} />,
        // 'map-pin': <FeatherIcon style={style} name={icon} size={size} color={color} />,
        'map-pin': <MaterialIcon style={style} name={"map"} size={size} color={color} />,
        // 'terminal': <FeatherIcon style={style} name={icon} size={size} color={color} />,
        'terminal': <MaterialCommunityIcon style={style} name={icon} size={size} color={color} />,
        // 'camera': <FeatherIcon style={style} name={icon} size={size} color={color} />,
        'camera': <MaterialCommunityIcon style={style} name={icon} size={size} color={color} />,
        // 'power': <FeatherIcon style={style} name={icon} size={size} color={color} />,
        'power': <MaterialCommunityIcon style={style} name={icon} size={size} color={color} />,
        'moon-outline': <IonIcon style={style} name={icon} size={size} color={color} />,
        'refresh': <IonIcon style={style} name={icon} size={size} color={color} />,
    };

    return IconSet[icon];
};

export default IconComponent;
