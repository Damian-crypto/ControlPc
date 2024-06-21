import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text } from 'react-native';

import SettingsScreen from './SettingsScreen';
import Dashboard from './Dashboard';
import InformationScreen from './InformationScreen';
import IconComponent from '../components/IconComponent';

const DrawerNav = createDrawerNavigator();

const DrawerScreen = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <DrawerNav.Navigator
                initialRouteName='Dashboard'>
                <DrawerNav.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        drawerIcon: ({ focused, size }) => (
                            <IconComponent icon={"apps"} size={size} color={focused ? "#00c2ff" : "#000"} />
                        )
                    }}
                />
                <DrawerNav.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        drawerIcon: ({ focused, size }) => (
                            <IconComponent icon={"settings"} size={size} color={focused ? "#00c2ff" : "#000"} />
                        )
                    }}
                />
                <DrawerNav.Screen
                    name="Information"
                    component={InformationScreen}
                    options={{
                        drawerIcon: ({ focused, size }) => (
                            <IconComponent icon={"info"} size={size} color={focused ? "#00c2ff" : "#000"} />
                        )
                    }}
                />
            </DrawerNav.Navigator>
        </GestureHandlerRootView>
    );
};

export default DrawerScreen;
