import React, { useEffect, useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
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
import ThemeContext from './context/ThemeContext';

const NavStack = createNativeStackNavigator();

// SplashScreen.preventAutoHideAsync();

const App = () => {
	const [appIsReady, setAppIsReady] = useState(true);
	const [authContext, setAuthContext] = useState(
		{
			"identity": "",
			"mainIP": "",
			"port": "",
			"getBaseURL": function () {
				return `http://${this.mainIP}:${this.port}`
			}
		}
	);
	const [themeContext, setThemeContext] = useState(
		{
			"blurRadius": 75,
			"bgImage": require("./assets/images/bgBlue.png"),
			"navColor": "red"
		}
	);

	// useEffect(() => {
	// 	async function prepare() {
	// 		try {
	// 			const images = [
	// 				require('./assets/app/icon.png'),
	// 			];

	// 			const cacheImages = images.map(img => {
	// 				return Asset.loadAsync(img);
	// 			});

	// 			return await Promise.all(cacheImages);
	// 		} catch (e) {
	// 			// console.warn(e);
	// 		} finally {
	// 			setAppIsReady(true);
	// 		}
	// 	}

	// 	prepare().then((res) => setAppIsReady(true)).catch((rej) => setAppIsReady(false));
	// }, []);

	// useEffect(() => {
	// 	if (appIsReady) {
	// 		SplashScreen.hideAsync();
	// 	}
	// }, [appIsReady]);

	const navHeaderOptions = (show) => {
		return ({
			headerShown: show,
			headerStyle: {
				backgroundColor: 'white',
			},
			headerTintColor: 'black',
			// headerBlurEffect: 'light',
			headerTransparent: true,
		});
	};

	// const MyTheme = {
	// 	dark: false,
	// 	colors: {
	// 		primary: 'rgb(0, 122, 255)',
	// 		background: 'rgb(50, 50, 50)',
	// 		card: 'rgba(255, 0, 0, 0.5)',
	// 		text: 'rgb(28, 28, 30)',
	// 		border: 'rgb(216, 216, 216)',
	// 		notification: 'rgb(255, 59, 48)',
	// 	},
	// };

	return (
		<AuthContext.Provider value={authContext}>
			<ThemeContext.Provider value={themeContext}>
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
									options={navHeaderOptions(false)}
								/>
								<NavStack.Screen
									name="Setup"
									component={SetupScreen}
									options={navHeaderOptions(true)}
								/>
								<NavStack.Screen
									name="Dashboard"
									component={Dashboard}
									options={navHeaderOptions(true)}
								/>
								<NavStack.Screen
									name="Live Screen"
									component={LiveScreen}
									options={navHeaderOptions(true)}
								/>
								<NavStack.Screen
									name="Terminal"
									component={TerminalScreen}
									options={navHeaderOptions(true)}
								/>
								<NavStack.Screen
									name="Settings"
									component={SettingsScreen}
									options={navHeaderOptions(true)}
								/>
								<NavStack.Screen
									name="Geo Location"
									component={GeoLocationScreen}
									options={navHeaderOptions(true)}
								/>
							</NavStack.Navigator>

							<StatusBar style="light-content" />
						</NavigationContainer>
				}
			</ThemeContext.Provider>
		</AuthContext.Provider>
	);
}

export default App;
