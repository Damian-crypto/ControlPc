import {
    View,
    Text,
    StyleSheet,
    TextInput,
} from "react-native";

const InputField = ({
    label,
    placeholder,
    value,
    onChange,
    flexGrow,
    fontStyles = styles.fontStyle
}) => {
    return (
        <View style={{
            padding: 10,
            flexGrow: flexGrow
        }}>
            <Text
                style={fontStyles}
            >
                {label}
            </Text>
            <TextInput
                style={[fontStyles, {
                    borderBottomWidth: 5,
                    borderColor: fontStyles.color,
                    fontSize: 24,
                }]}
                placeholder={placeholder}
                placeholderTextColor="#444"
                value={value}
                onChangeText={onChange}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    fontStyle: {
        color: '#fff',
    },
});

export default InputField;
