import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

export default function AppHeader({ navigation }: any) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() =>
          navigation.dispatch(DrawerActions.openDrawer())
        }
      >
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.center}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/2909/2909763.png',
          }}
          style={styles.logo}
        />

        <View>
          <Text style={styles.title}>AgroTech</Text>

          <Text style={styles.subtitle}>
            Monitoramento Inteligente
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.profile}>
        <Ionicons
          name="notifications-outline"
          size={22}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginHorizontal: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 16,

    backgroundColor: 'rgba(255,255,255,0.12)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  center: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  logo: {
    width: 42,
    height: 42,
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },

  subtitle: {
    color: '#B7E4C7',
    fontSize: 12,
  },

  profile: {
    width: 48,
    height: 48,
    borderRadius: 16,

    backgroundColor: 'rgba(255,255,255,0.12)',

    alignItems: 'center',
    justifyContent: 'center',
  },
});