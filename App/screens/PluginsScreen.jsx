import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    ImageBackground,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { StatusBar } from "expo-status-bar";

import SquareButton from "../components/SquareButton";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

const RenderItem = ({ uniqueKey, data, backgroundColor, onPress }) => {
    return (
        <ScrollView
            horizontal={true}
            style={[styles.renderItemContainer, {
                backgroundColor: backgroundColor,
                margin: 20,
                borderWidth: 2,
                maxHeight: 100,
                // borderColor: 'red',
            }]}
        >
            <TouchableOpacity
                onPress={onPress}
                key={uniqueKey}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    // borderWidth: 1,
                    // borderColor: 'red',
                }}
            >
                {/* <View style={styles.renderItemSubContainer}> */}
                <Text style={styles.renderItemText}>
                    {data["name"]}
                </Text>
                <Text style={styles.renderItemText}>
                    {"(Hi)"}
                </Text>
                {/* </View> */}
            </TouchableOpacity>
        </ScrollView>
    );
};

const PluginsScreen = ({ navigation, route }) => {
    const authContext = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);
    const baseURL = authContext.getBaseURL();
    const uuid = authContext['identity'];

    const plugins = [
        // {
        //     "name": "Server Manager",
        //     "url": "https://www.example.com/"
        // },
        // {
        //     "name": "Headless OS",
        //     "url": "https://www.example.com/"
        // }
    ];

    return (
        <ImageBackground
            style={styles.backgroundImage}
            source={themeContext.bgImage}
            blurRadius={themeContext.blurRadius}
        >
            <SafeAreaView style={styles.subContainer}>
                {
                    plugins.length == 0
                    ?
                    <Text style={{color: '#FFF', textAlign: 'center'}}>No plugins available!</Text>
                    :
                    plugins.map((item, idx) => {
                        return (<RenderItem uniqueKey={idx} data={item} />)
                    })
                }
            </SafeAreaView>
            <StatusBar style={"dark"} />
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
    },
    subContainer: {
        flex: 1,
        marginTop: 60,
        padding: 5,
    },
    renderItemContainer: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF50',
        marginVertical: 8,
        marginHorizontal: 16,
    },
    renderItemSubContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: 'red',
    },
    renderItemText: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default PluginsScreen;
