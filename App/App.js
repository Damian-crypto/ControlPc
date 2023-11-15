import React, { useEffect, useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Asset, useAssets } from "expo-asset";
import * as SplashScreen from 'expo-splash-screen';

import WelcomeScreen from './screens/WelcomeScreen';
import SetupScreen from './screens/SetupScreen';
import Dashboard from './screens/Dashboard';
import LiveScreen from './screens/LiveScreen';

const NavStack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

const App = () => {
	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		async function prepare() {
			try {
				const images = [
					require('./assets/images/QR.png'),
					require('./assets/images/power.png'),
					require('./assets/images/sleep.png'),
					require('./assets/images/restart.png'),
					require('./assets/images/camera.png'),
					require('./assets/images/zap.png')
				];

				const cacheImages = images.map(img => {
					return Asset.loadAsync(img);
				});

				return await Promise.all(cacheImages);
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true);
			}
		}

		prepare().then((res) => setAppIsReady(true)).catch((rej) => setAppIsReady(false));
	}, []);

	useEffect(() => {
		if (appIsReady) {
			SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	return (
		!appIsReady
			?
			null
			:
			<NavigationContainer>
				<NavStack.Navigator>
					<NavStack.Screen
						name="Welcome"
						component={WelcomeScreen}
						options={{
							headerShown: false,
						}} />
					<NavStack.Screen
						name="Setup"
						component={SetupScreen}
						options={{
							headerShown: true,
						}} />
					<NavStack.Screen
						name="Dashboard"
						component={Dashboard}
						options={{
							headerShown: true,
						}} />
					<NavStack.Screen
						name="Live Screen"
						component={LiveScreen}
						options={{
							headerShown: true,
						}} />
				</NavStack.Navigator>

				<StatusBar style="auto" />
			</NavigationContainer>
	);
}

export default App;
