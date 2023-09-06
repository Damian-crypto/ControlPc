import { TouchableOpacity, Image } from "react-native";

const ClickableImage = ({ image, onTouch, style }) => {
    return (
        <TouchableOpacity
            onPress={onTouch}
        >
            <Image style={style} source={image} />
        </TouchableOpacity>
    )
};

export default ClickableImage;
