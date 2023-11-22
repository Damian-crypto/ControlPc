import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Button, Text, TextInput, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

import RoundedButton from '../components/RoundedButton';
import SquareButton from "../components/SquareButton";

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
    const [visibleControlsPanel, setVisibleControlsPanel] = useState(true);
    const [keyEventValue, setKeyEventValue] = useState('');
    const webViewRef = useRef(null);

    useFocusEffect(React.useCallback(() => {
        // console.log('Started the screen!');
        onScreenServer('start');

        return () => {
            // console.log('Left the screen!');
            onScreenServer('end');
        };
    }, []));

    function showKeyboard() {
        setVisibleControlsPanel(false);
    }

    function hideKeyboard() {
        setVisibleControlsPanel(true);
    }

    function onViewChange(view, port) {
        fetch(`${baseUrl}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: uuid,
                command: `screenserver_${view}`,
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
            .catch((error) => {
                setScreen(false);
                alert(`Error occurred with live screen: ${error}`);
            });
    }

    function onScreenServer(cmd) {
        // console.log(baseUrl);
        fetch(`${baseUrl}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: uuid,
                command: `screenserver_${cmd}`,
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
            .catch((error) => {
                setScreen(false);
                alert(`Error occurred with live screen: ${error}`);
            });
    }

    async function handleKeyEvents(key) {
        await fetch(`${baseUrl}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: uuid,
                command: "keyboard_pressed",
                keyCode: key,
            })
        })
            .then((response) => {
                return null;
            })
            .catch((error) => {
                alert(`Error occurred with key strokes: ${error}`);
            });
    }

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

            {
                visibleControlsPanel
                    ?
                    <View style={styles.controls}>
                        <View style={styles.controlsRow}>
                            <Text style={styles.txtStyle}>Screen Mode</Text>
                            <ModeSelector selected={screenMode} onChange={(itemValue) => {
                                setScreenMode(itemValue);
                                setScreen(false);
                            }}
                            />
                            <RoundedButton
                                label={"Keyboard"}
                                width={100}
                                height={40}
                                fontSize={16}
                                onTouch={showKeyboard}
                            />
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
                                onTouch={() => onViewChange(screenMode, camPort)}
                            />
                        </View>
                    </View>
                    :
                    <View style={styles.controls}>
                        <View style={styles.controlsRow}>
                            <TextInput style={{
                                borderWidth: 1,
                                borderColor: '#ff0',
                                flex: 1,
                                fontSize: 16,
                                color: '#fff',
                                textAlign: 'center',
                                backgroundColor: '#333'
                            }}
                            value={keyEventValue}
                            placeholder="Type here to send key strokes..."
                            onChangeText={setKeyEventValue}
                            onKeyPress={async ({ nativeEvent }) => await handleKeyEvents(nativeEvent.key) }
                            autoFocus={true} />
                        </View>
                        <View style={styles.controlsRow}>
                            <SquareButton
                                style={styles.keyboardButton}
                                label={"ESC"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={ () => { handleKeyEvents('esc') }}
                            />
                            <SquareButton
                                style={styles.keyboardButton}
                                label={"HOME"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('home') }}
                            />
                            <SquareButton
                                style={styles.keyboardButton}
                                label={"ALT"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('alt') }}
                            />
                            <SquareButton
                                style={styles.keyboardButton}
                                label={"CTRL"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('ctrl') }}
                            />
                            <SquareButton
                                style={styles.keyboardButton}
                                label={"PGUP"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('pgup') }}
                            />
                        </View>
                        <View style={styles.controlsRow}>
                            <SquareButton
                                style={styles.keyboardButton}
                                label={"TAB"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('tab') }}
                            />
                            <SquareButton
                                style={styles.keyboardButton}
                                label={"END"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('end') }}
                            />
                            <SquareButton
                                style={styles.keyboardButton}
                                label={"INSRT"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('insert') }}
                            />
                            <SquareButton
                                style={styles.keyboardButton}
                                label={"🔼"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('up') }}
                            />
                            <SquareButton
                                style={styles.keyboardButton}
                                label={"PGDN"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('pgdn') }}
                            />
                        </View>
                        <View style={styles.controlsRow}>
                            <SquareButton
                                customStyle={styles.keyboardButton}
                                label={"EXIT"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={hideKeyboard}
                            />
                            <SquareButton
                                customStyle={styles.keyboardButton}
                                label={"SHFT"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('leftshift') }}
                            />
                            <SquareButton
                                customStyle={styles.keyboardButton}
                                label={"◀️"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('left') }}
                            />
                            <SquareButton
                                customStyle={styles.keyboardButton}
                                label={"🔽"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('down') }}
                            />
                            <SquareButton
                                customStyle={styles.keyboardButton}
                                label={"▶️"}
                                width={60}
                                height={40}
                                fontSize={16}
                                onTouch={() => { handleKeyEvents('right') }}
                            />
                        </View>
                    </View>
            }
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
        margin: 5,
    },
    webViewStyle: {
        flex: 1,
        backgroundColor: '#000',
    }
});

export default LiveScreen;
