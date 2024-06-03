import { TouchableOpacity, Image } from "react-native";
import IconComponent from "./IconComponent";

const ClickableImage = ({ image, onTouch, style, icon, iconSize=100 }) => {
    return (
        <TouchableOpacity
            onPress={onTouch}
        >
            {
                image == undefined || image == null
                ?
                <IconComponent icon={icon} size={iconSize} style={style} color={style['color']} />
                :
                <Image style={style} source={image} />
            }
        </TouchableOpacity>
    )
};

export default ClickableImage;
