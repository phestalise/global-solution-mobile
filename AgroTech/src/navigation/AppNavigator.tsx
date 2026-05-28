// src/navigation/AppNavigator.tsx
import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../styles/colors';

// Screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/Dashboardscreen';
import PropriedadesScreen from '../screens/Propriedadesscreen';
import DetalhesPropriedadeScreen from '../screens/Detalhespropriedadescreen';
import FormPropriedadeScreen from '../screens/Formpropriedadescreen';
import AlertasScreen from '../screens/Alertasscreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ── Custom Tab Bar Label ──────────────────────────────────────────────────────
function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
      {label}
    </Text>
  );
}

// ── Propriedades Stack (tela lista + detalhes + form) ────────────────────────
function PropriedadesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaPropriedades"   component={PropriedadesScreen} />
      <Stack.Screen name="DetalhesPropriedade" component={DetalhesPropriedadeScreen} />
      <Stack.Screen name="FormPropriedade"     component={FormPropriedadeScreen} />
    </Stack.Navigator>
  );
}

// ── Main Tabs ─────────────────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Dashboard" focused={focused} />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="planet-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Propriedades"
        component={PropriedadesStack}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Fazendas" focused={focused} />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Alertas"
        component={AlertasScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Alertas" focused={focused} />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ── Root Navigator ────────────────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.bgCard,
    borderTopColor:  Colors.border,
    borderTopWidth:  1,
    height:          64,
    paddingBottom:   8,
    paddingTop:      6,
  },
  tabLabel: {
    fontSize:   10,
    color:      Colors.textMuted,
    marginTop:  2,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
});