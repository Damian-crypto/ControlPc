import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import MapView from 'react-native-maps';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import AuthContext from '../context/AuthContext';

const GeoLocationScreen = () => {
    const authContext = useContext(AuthContext);
    const baseURL = authContext.getBaseURL();
    const uuid = authContext.identity;

    const [geoLocation, setGeoLocation] = useState([0, 0]);
    const [loadingData, setLoadingData] = useState(false);

    async function getGeoLocation() {
        await fetch(`${baseURL}/geo_location`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uuid: uuid,
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Invalid request! ${response.json()["message"]}`);
                }
                return response.json();
            })
            .then(data => {
                setGeoLocation(data);
                setLoadingData(false);
            })
            .catch((error) => {
                alert(`Connection failed[❌]: ${error}`);
            });
    }

    useEffect(() => {
        setLoadingData(true);
        getGeoLocation();
    }, []);

    return (
        <View style={styles.container}>
            {
                loadingData
                    ?
                    <View style={styles.loadingView}>
                        <ActivityIndicator size="large" />
                        <Text>Fetching target location...</Text>
                    </View>
                    :
                    <MapView style={styles.map} provider={PROVIDER_GOOGLE}>
                        <Marker
                            coordinate={{
                                longitude: geoLocation[1],
                                latitude: geoLocation[0]
                            }}
                            onPress={(e) => { console.log(e.nativeEvent) }}
                        />
                    </MapView>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default GeoLocationScreen;
