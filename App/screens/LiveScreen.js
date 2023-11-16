import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Button, Text, TextInput, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

import RoundedButton from '../components/Button';

const NativeVideoComponent = ({ streamLink }) => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    return (
        <View>
            <Video
                source={{
                    uri: streamLink
                }}
                rate={1.0}
                volume={1.0}
                isMuted={true}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                style={styles.video}
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />

            <View style={styles.buttons}>
                <Button
                    title={status.isPlaying ? 'Pause' : 'Play'}
                    onPress={() =>
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                    }
                />
            </View>
        </View>
    );
};

const WebViewComponent = ({ webViewRef, targetURL, uuid, html }) => {
    return (
        html
            ?
            <WebView
                ref={webViewRef}
                style={styles.webViewStyle}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{
                    uri: `${targetURL}/remote`
                }}
                injectedJavaScriptBeforeContentLoaded={`window.localStorage.setItem("targetURL", "${targetURL}"); window.localStorage.setItem("uuid", "${uuid}"); true;`}
                onMessage={(evt) => { }}
            />
            :
            <WebView
                ref={webViewRef}
                style={styles.webViewStyle}
                source={{
                    html: `<img src="${targetURL}"/>`
                }}
            />
    );
};

const ModeSelector = ({ selected, onChange }) => {
    return (
        <Picker
            selectedValue={selected}
            onValueChange={onChange}
            style={styles.modeSelector}
        >
            <Picker.Item label="Screen" value="Screen" />
            <Picker.Item label="Camera" value="Camera" />
        </Picker>
    );
};

const LiveScreen = ({ navigation, route }) => {
    const { baseUrl, uuid } = route.params;
    const [screen, setScreen] = useState(false);
    const [screenMode, setScreenMode] = useState("Screen");
    const [camPort, setCamPort] = useState(0);
    const webViewRef = useRef(null);

    function onScreenServer(cmd, view, port) {
        // console.log(baseUrl);
        fetch(`${baseUrl}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: uuid,
                command: 'screenserver',
                act: cmd,
                view: view,
                camport: port.toString()
            })
        })
            .then((response) => {
                setScreen(true);
                if (webViewRef.current) {
                    // console.log('Reloading...');
                    webViewRef.current.reload();
                }

                return '';
            })
            .then((data) => {
                // alert(`Video data received: ${data['message']}`);
            })
            .catch((error) => {
                setScreen(false);
                alert(`Error occurred with live screen: ${error}`);
            });
    }

    useFocusEffect(React.useCallback(() => {
        // console.log('Started the screen!');
        onScreenServer('start', screenMode, camPort);

        return () => {
            // console.log('Left the screen!');
            onScreenServer('end', screenMode, camPort);
        };
    }, []));

    return (
        <View style={styles.container}>
            {
                screen
                    ?
                    screenMode === "Screen"
                        ?
                        <WebViewComponent targetURL={baseUrl} webViewRef={webViewRef} html={true} uuid={uuid} />
                        :
                        <WebViewComponent targetURL={`${baseUrl}/screenstream`} webViewRef={webViewRef} html={false} />
                    :
                    <View>
                        <ActivityIndicator size="large" />
                        <Text style={styles.txtStyle}>Connecting...</Text>
                    </View>
            }

            <View style={styles.controls}>
                <View style={styles.controlsRow}>
                    <Text style={styles.txtStyle}>Screen Mode</Text>
                    <ModeSelector selected={screenMode} onChange={(itemValue) => {
                        setScreenMode(itemValue);
                        setScreen(false);
                    }}
                    />
                    {/* <RoundedButton
                        label={"Reload"}
                        width={80}
                        height={40}
                        fontSize={16}
                        onTouch={() => webViewRef.current.reload() }
                    /> */}
                </View>
                <View style={styles.controlsRow}>
                    <View style={styles.inputWithLabel}>
                        <Text style={[styles.txtStyle,
                        {
                            // borderColor: '#f00',
                            // borderWidth: 2,
                        }
                        ]}>{screenMode} Port</Text>
                        <TextInput
                            style={[styles.txtStyle, {
                                margin: 10,
                                // borderColor: '#f00',
                                // borderWidth: 2,
                            }]}
                            value={camPort.toString()}
                            onChangeText={(val) => setCamPort(parseInt(val))}
                        />
                    </View>
                    <RoundedButton
                        label={"+"}
                        width={40}
                        height={40}
                        fontSize={16}
                        onTouch={() => { setCamPort(camPort + 1) }}
                    />
                    <RoundedButton
                        label={"-"}
                        width={40}
                        height={40}
                        fontSize={16}
                        onTouch={() => { setCamPort(Math.max(0, camPort - 1)) }}
                    />
                    <RoundedButton
                        label={"Apply"}
                        width={80}
                        height={40}
                        fontSize={16}
                        onTouch={() => onScreenServer('start', screenMode, camPort)}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: '#ecf0f1',
        color: '#fff',
        backgroundColor: '#000',
        padding: 5,
    },
    modeSelector: {
        backgroundColor: '#fff',
        width: 50,
        height: 50,
    },
    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
    },
    controls: {
        flexDirection: 'column',
    },
    inputWithLabel: {
        flexDirection: 'row',

        color: '#fff',
        // borderColor: '#ff0',
        // borderWidth: 2,
    },
    txtStyle: {
        color: '#fff',
        fontSize: 12,
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
    },
    controlsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    webViewStyle: {
        flex: 1,
        backgroundColor: '#000',
    },
});

export default LiveScreen;
