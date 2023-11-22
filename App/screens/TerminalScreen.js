import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SquareButton from "../components/SquareButton";

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
    const { baseURL, uuid } = route.params;
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
            .catch((err) => {
                alert(err);
            });
    }

    return (
        <View style={styles.backgroundView}>
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
            <SafeAreaView style={styles.subContainer}>
                <ScrollView>
                    <View style={styles.resultOutput}>
                        {
                            resultSet.map((res, i) => {
                                return (
                                    <ResultComponent uniqueKey={i} output={res} />
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
};

const styles = StyleSheet.create({
    backgroundView: {
        flex: 1,
        backgroundColor: 'black',
        padding: 15,
    },
    subContainer: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // padding: 15,
    },
    commandInput: {
        // borderWidth: 1,
        // borderColor: '#ff0',
        // flex: 1,
        flexDirection: 'row',
    },
    input: {
        flex: 1,
        borderColor: '#fff',
        // borderWidth: 1,
        borderBottomWidth: 2,
        backgroundColor: '#333',
        color: '#0f0',
        height: 50,
        fontFamily: 'monospace',
        fontWeight: 'bold',
    },
    resultOutput: {
        // borderWidth: 1,
        // borderColor: '#ff0',
        flex: 1,
        // flexDirection: 'row',
        marginBottom: 100,
    },
});

export default TerminalScreen;
