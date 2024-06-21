import React, { useEffect, useState, useContext, useCallback } from 'react';

import { Asset } from "expo-asset";
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Dashboard from './screens/Dashboard';
import LiveScreen from './screens/LiveScreen';
import AuthContext from './context/AuthContext';
import SetupScreen from './screens/SetupScreen';
import ThemeContext from './context/ThemeContext';
import WelcomeScreen from './screens/WelcomeScreen';
import TerminalScreen from './screens/TerminalScreen';
import SettingsScreen from './screens/SettingsScreen';
import GeoLocationScreen from './screens/GeoLocationScreen';
import ProcessManagerScreen from './screens/ProcessManagerScreen';
import DrawerScreen from './screens/DrawerScreen';

const NavStack = createNativeStackNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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
			"bgImage": require("./assets/images/bg_blue.png"),
			"navColor": "red"
		}
	);

	useEffect(() => {
		async function prepare() {
			try {
				const images = [
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

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			// This tells the splash screen to hide immediately! If we call this after
			// `setAppIsReady`, then we may see a blank screen while the app is
			// loading its initial state and rendering its first pixels. So instead,
			// we hide the splash screen once we know the root view has already
			// performed layout.
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return null;
	}

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
				<NavigationContainer onReady={onLayoutRootView}>
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
							name="Drawer"
							component={DrawerScreen}
							options={navHeaderOptions(false)}
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
						<NavStack.Screen
							name="Process Manager"
							component={ProcessManagerScreen}
							options={navHeaderOptions(true)}
						/>
					</NavStack.Navigator>

					<StatusBar style="light" />
				</NavigationContainer>
			</ThemeContext.Provider>
		</AuthContext.Provider>
	);
}

export default App;
