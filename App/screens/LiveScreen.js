import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';

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

const WebViewComponent = ({ streamLink }) => {
    return (
        <WebView
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            source={{ uri: streamLink }}
        />
    );
};

const LiveScreen = ({ navigation, route }) => {
    const { baseUrl, uuid } = route.params;
    const [screen, setScreen] = useState(false);

    useEffect(() => {
        console.log(baseUrl);
        fetch(`${baseUrl}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: uuid,
                command: 'screenserver',
                act: 'start',
                view: 'screen'
            })
        })
            .then((response) => response.json())
            .then((data) => {
                setScreen(true);
                alert(`Video data received: ${data['message']}`);
            })
            .catch((error) => {
                setScreen(false);
                alert(`Error occurred with power: ${error}`);
            });
    }, []);

    return (
        <View style={styles.container}>
            {screen ? <WebViewComponent streamLink={'http://192.168.1.101:5000/screenstream'} /> : <Text>Connecting</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LiveScreen;
