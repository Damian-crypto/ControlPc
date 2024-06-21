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

const RenderItem = ({ uniqueKey, res, backgroundColor, onPress }) => {
    return (
        <ScrollView
            horizontal={true}
            style={[styles.renderItemContainer, {
                backgroundColor: backgroundColor,
                margin: 20,
                borderWidth: 2,
                borderColor: 'red',
            }]}
        >
            <TouchableOpacity
                onPress={onPress}
                key={uniqueKey}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    gap: 10,
                }}
            >
                {/* <View style={styles.renderItemSubContainer}> */}
                <Text style={styles.renderItemText}>
                    {res["pid"]}
                </Text>
                <Text style={styles.renderItemText}>
                    {res["title"]}
                </Text>
                {/* </View> */}
            </TouchableOpacity>
        </ScrollView>
    );
};

const ProcessManagerScreen = ({ navigation, route }) => {
    const authContext = useContext(AuthContext);
    const themeContext = useContext(ThemeContext);
    const baseURL = authContext.getBaseURL();
    const uuid = authContext['identity'];
    const [selectedId, setSelectedId] = useState(0);

    const [resultSet, setResultSet] = useState([]);
    const [ramUsage, setRAMUsage] = useState({
        // labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            data: [0]
        }],
        legend: ['RAM Usage']
    });
    const [cpuUsage, setCPUUsage] = useState({
        datasets: [{
            data: [0]
        }],
        legend: ['CPU Usage']
    });

    async function getRunningProcess() {
        await fetch(`${baseURL}/running_processes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: uuid,
            })
        })
            .then((res) => res.json())
            .then((data) => {
                const flatData = [];
                data.map((task) => {
                    if (!isNaN(Number(task[3]))) {
                        flatData.push({
                            pid: parseInt(task[3]),
                            title: task[1]
                        });
                    }
                });
                setResultSet(flatData);
            })
            .catch((error) => {
                alert(`Connection error ${baseURL} -> ${error}`);
            });
    }

    async function getResourceUsage() {
        await fetch(`${baseURL}/get_resource_usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: uuid,
            })
        })
            .then((res) => res.json())
            .then((data) => {
                ramUsage.datasets[0].data.push(data['ram'])
                if (ramUsage.datasets[0].data.length > 10) {
                    ramUsage.datasets[0].data.splice(0, 1);
                }
                cpuUsage.datasets[0].data.push(data['cpu'])
                if (cpuUsage.datasets[0].data.length > 10) {
                    cpuUsage.datasets[0].data.splice(0, 1);
                }
            })
            .catch((error) => {
                alert(`Connection error ${baseURL} -> ${error}`);
            });
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            getRunningProcess();
            getResourceUsage();
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    const chartConfig = {
        backgroundGradientFrom: '#1E2923',
        backgroundGradientTo: '#08130D',
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        propsForDots: {
            r: "2",
            strokeWidth: "0",
            stroke: "#ffa726"
        }
    };

    const screenWidth = Dimensions.get('window').width

    return (
        <ImageBackground
            style={styles.backgroundImage}
            source={themeContext.bgImage}
            blurRadius={themeContext.blurRadius}
        >
            <SafeAreaView style={styles.subContainer}>
                <ScrollView style={styles.processList}>
                    <View style={styles.statViewer}>
                        <LineChart
                            data={ramUsage}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                        />
                        <LineChart
                            data={cpuUsage}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                        />
                    </View>
                    {
                        resultSet.map((task, i) => {
                            const backgroundColor = selectedId == i ? '#FFFFFF50' : '#00000050';
                            return (
                                <RenderItem
                                    key={i}
                                    uniqueKey={i}
                                    res={task}
                                    backgroundColor={backgroundColor}
                                    onPress={() => setSelectedId(i)}
                                />
                            )
                        })
                    }
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
    statViewer: {
        flex: 1,
    },
    processList: {
        flex: 1,
    }
});

export default ProcessManagerScreen;
