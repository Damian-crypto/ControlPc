import React, { useState, useEffect } from 'react';
import { Text, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import RoundedButton from './RoundedButton';

const QRScannerModal = ({ setData, visible, setVisible }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
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

export default QRScannerModal;
