import React, { useEffect, useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Asset } from "expo-asset";
import * as SplashScreen from 'expo-splash-screen';

import WelcomeScreen from './screens/WelcomeScreen';
import SetupScreen from './screens/SetupScreen';
import Dashboard from './screens/Dashboard';
import LiveScreen from './screens/LiveScreen';
import TerminalScreen from './screens/TerminalScreen';
import SettingsScreen from './screens/SettingsScreen';
import GeoLocationScreen from './screens/GeoLocationScreen';

import AuthContext from './context/AuthContext';

const NavStack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

const App = () => {
	const [appIsReady, setAppIsReady] = useState(false);
	const [contextInfo, setContextInfo] = useState(
		{
			"identity": "iidlbxwdmo",
			"mainIP": "192.168.1.101",
			"port": "5000",
			"getBaseURL": function () {
				return `http://${this.mainIP}:${this.port}`
			}
		}
	);

	useEffect(() => {
		async function prepare() {
			try {
				const images = [
					require('./assets/images/qr.png'),
					require('./assets/images/power.png'),
					require('./assets/images/sleep.png'),
					require('./assets/images/restart.png'),
					require('./assets/images/camera.png'),
					require('./assets/images/settings.png'),
					require('./assets/images/box.png'),
					require('./assets/images/terminal.png'),
					require('./assets/images/info.png'),
					require('./assets/app/icon.png'),
				];

				const cacheImages = images.map(img => {
					return Asset.loadAsync(img);
				});

				return await Promise.all(cacheImages);
			} catch (e) {
				// console.warn(e);
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
		<AuthContext.Provider value={contextInfo}>
			{
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
							<NavStack.Screen
								name="Terminal"
								component={TerminalScreen}
								options={{
									headerShown: true,
								}} />
							<NavStack.Screen
								name="Settings"
								component={SettingsScreen}
								options={{
									headerShown: true,
								}} />
							<NavStack.Screen
								name="Geo Location"
								component={GeoLocationScreen}
								options={{
									headerShown: true,
								}} />
						</NavStack.Navigator>

						<StatusBar style="auto" />
					</NavigationContainer>
			}
		</AuthContext.Provider>
	);
}

export default App;
