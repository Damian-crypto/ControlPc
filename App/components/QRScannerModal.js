import React, { useState, useEffect } from 'react';
import { Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import RoundedButton from './RoundedButton';

const QRScannerModal = ({ setIdentity, visible, setVisible }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getQRScannerPersmissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getQRScannerPersmissions();
    }, []);

    const onQRScanned = ({type, data}) => {
        setScanned(true);
        // console.log(`Code scanned with type ${type}, and data is ${data}`);
        setIdentity(data);
        setVisible(false);
    };

    if (hasPermission === null) {
        return <Text>The app does not have permission to access your camera.</Text>;
    }

    if (hasPermission === false) {
        return <Text>You have disallowed access to your camera!</Text>
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >
            <TouchableOpacity style={{
                flex: 1,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
                onPress={() => setVisible(false)}
            >
                <BarCodeScanner
                    style={StyleSheet.absoluteFill}
                    onBarCodeScanned={scanned ? undefined : onQRScanned}
                />
                {
                    scanned
                    &&
                    <RoundedButton
                        label={"Scan Again"}
                        onTouch={() => setScanned(false)}
                    />
                }
            </TouchableOpacity>
        </Modal>
    )
};

export default QRScannerModal;
