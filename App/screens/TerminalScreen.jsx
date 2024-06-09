import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SquareButton from "../components/SquareButton";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";
import { StatusBar } from "expo-status-bar";

const ResultComponent = ({ uniqueKey, output, error }) => {
    return (
        <ScrollView key={uniqueKey} horizontal={true} style={{
            flexDirection: 'row',
            borderBottomWidth: 2,
            borderColor: '#fff',
        }}>
            <Text key={uniqueKey} style={{
                color: '#0f0',
                fontSize: 16,
                fontFamily: 'monospace',
                fontWeight: 'bold',
            }}>
                {output}
            </Text>
        </ScrollView>
    );
};

const TerminalScreen = ({ navigation, route }) => {
    const authContext = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);
    const baseURL = authContext.getBaseURL();
    const uuid = authContext['identity'];

    const [command, setCommand] = useState('dir');
    const [resultSet, setResultSet] = useState([]);

    async function sendToTerminal(cmd1, cmd2) {
        await fetch(`${baseURL}/terminal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: uuid,
                primaryCmd: cmd1,
                secondaryCmd: cmd2,
            })
        })
            .then((res) => res.json())
            .then((data) => {
                setResultSet([data["output"], ...resultSet])
            })
            .catch((error) => {
                alert(`Connection error ${baseURL} -> ${error}`);
            });
    }

    return (
        <ImageBackground
            style={styles.backgroundImage}
            source={themeContext.bgImage}
            blurRadius={themeContext.blurRadius}
        >
            <SafeAreaView style={styles.subContainer}>
                <View style={styles.commandInput}>
                    <TextInput style={styles.input}
                        placeholder="Type your command here..."
                        value={command}
                        onChangeText={setCommand}
                    />
                    <SquareButton
                        label={">"}
                        width={50}
                        onTouch={() => { sendToTerminal(command, ''); }}
                    />
                </View>
                <ScrollView>
                    <View style={styles.resultOutput}>
                        {
                            resultSet.map((res, i) => {
                                return (
                                    <ResultComponent key={i} uniqueKey={i} output={res} />
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>

            <StatusBar style={"dark"} />
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        // borderWidth: 1,
        // borderColor: 'red',
    },
    subContainer: {
        flex: 1,
        marginTop: 60,
        padding: 5,
    },
    commandInput: {
        flexDirection: 'row',
    },
    input: {
        flex: 1,
        borderColor: '#fff',
        borderBottomWidth: 2,
        backgroundColor: '#333',
        color: '#0f0',
        height: 50,
        fontFamily: 'monospace',
        fontWeight: 'bold',
        padding: 5,
    },
    resultOutput: {
        flex: 1,
        marginBottom: 100,
        // borderWidth: 1,
        // borderColor: '#ff0',
    },
});

export default TerminalScreen;
