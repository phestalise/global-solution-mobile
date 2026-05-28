import React from 'react';
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#050816',
        },
        drawerActiveTintColor: '#00F5A0',
        drawerInactiveTintColor: '#FFF',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
      />

      <Drawer.Screen
        name="Perfil"
        component={ProfileScreen}
      />

      <Drawer.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
    </Drawer.Navigator>
  );
}