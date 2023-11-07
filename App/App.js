import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './screens/WelcomeScreen';
import SetupScreen from './screens/SetupScreen';
import Dashboard from './screens/Dashboard';
import LiveScreen from './screens/LiveScreen';

const NavStack = createNativeStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<NavStack.Navigator>
				<NavStack.Screen
					name = "Welcome"
					component = {WelcomeScreen}
					options={{
						headerShown: false,
					}}/>
				<NavStack.Screen
					name = "Setup"
					component = {SetupScreen}
					options={{
						headerShown: true,
					}}/>
				<NavStack.Screen
					name = "Dashboard"
					component = {Dashboard}
					options={{
						headerShown: true,
					}}/>
				<NavStack.Screen
					name = "Live Screen"
					component = {LiveScreen}
					options={{
						headerShown: true,
					}}/>
			</NavStack.Navigator>

			<StatusBar style="auto"/>
		</NavigationContainer>
	);
}

export default App;
