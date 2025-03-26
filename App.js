import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import PlaylistScreen from './screens/PlaylistScreen';
import AudioPlayer from './AudioPlayer';
import PlaylistManagerScreen from './screens/PlaylistManagerScreen';
import SettingScreen from './screens/SettingScreen';
import { enableScreens } from 'react-native-screens';
enableScreens();

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={AudioPlayer} options={{ title: 'Audio Player' }} />
        <Drawer.Screen name="Playlist" component={PlaylistScreen} options={{ title: 'Playlist' }} />
        <Drawer.Screen name="Playlist Manager" component={PlaylistManagerScreen} />
        <Drawer.Screen name="Settings" component={SettingScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}