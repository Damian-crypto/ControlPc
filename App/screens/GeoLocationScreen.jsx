import React, { useContext, useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import AuthContext from '../context/AuthContext';

const GeoLocationScreen = () => {
    const authContext = useContext(AuthContext);
    const baseURL = authContext.getBaseURL();
    const uuid = authContext.identity;

    const [geoLocation, setGeoLocation] = useState([0, 0]);

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
            })
            .catch((error) => {
                alert(`Connection failed[❌]: ${error}`);
            });
    }

    useEffect(() => { getGeoLocation(); }, []);

    return (
        <View style={styles.container}>
            <MapView style={styles.map}>
                <Marker
                    coordinate={{
                        longitude: geoLocation[1],
                        latitude: geoLocation[0]
                    }}
                    onPress={(e) => { console.log(e.nativeEvent) }}
                />
            </MapView>
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
});

export default GeoLocationScreen;
