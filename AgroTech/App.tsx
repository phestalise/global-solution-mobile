import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0A1628' }}>
      <StatusBar style="light" />

      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
}