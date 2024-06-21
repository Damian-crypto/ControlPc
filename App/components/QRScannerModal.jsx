import React, { useState, useEffect } from 'react';
import { Text, Modal, StyleSheet, TouchableOpacity, View, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import RoundedButton from './RoundedButton';

const QRScannerModal = ({ setData, visible, setVisible }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    if (!permission) {
        // Camera permissions are still loading.
        return (
            <View>
                <Text>Loading permissions...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                style={{ flex: 1 }}
            >
                <TouchableOpacity style={styles.permissionDeniedContainer} onPress={() => {setVisible(false)}}>
                    <Text style={{ textAlign: 'center', fontSize: 24 }}>
                        Please grant permission to use your camera for QR scanner
                    </Text>
                    <RoundedButton label={"Grant Permission"} fontSize={16} onTouch={requestPermission} />
                </TouchableOpacity>
            </Modal>
        );
    }

    const onQRScanned = ({ type, data }) => {
        setScanned(true);
        setData(data);
        setVisible(false);
    };


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            style={{ flex: 1 }}
        >
            <CameraView
                style={{ flex: 1 }}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                facing={"back"}
                onBarcodeScanned={onQRScanned}
            >
                <TouchableOpacity style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
                    onPress={() => setVisible(false)}
                >
                    {
                        scanned
                        &&
                        <RoundedButton
                            label={"Scan Again"}
                            onTouch={() => setScanned(false)}
                        />
                    }
                </TouchableOpacity>
            </CameraView>
        </Modal>
    )
};

const styles = StyleSheet.create({
    permissionDeniedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    }
});

export default QRScannerModal;
