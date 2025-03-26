import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import commonStyle from '../styles/commonStyle';

export default function SettingsScreen() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const toggleSwitch = () => setIsDarkTheme(previousState => !previousState);

  return (
    <View style={commonStyle.container}>
      <Text style={commonStyle.title}>Settings</Text>
      <View style={commonStyle.itemContainer}>
        <Text style={commonStyle.text}>Dark Theme</Text>
        <Switch onValueChange={toggleSwitch} value={isDarkTheme} />
      </View>
    </View>
  );
}

