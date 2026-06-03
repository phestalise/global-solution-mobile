import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useAuth } from "../context/AuthContext";

const MENU_ITEMS = [
  { label: "Dashboard",           icon: "grid-outline",       route: "Dashboard" },
  { label: "Minhas Propriedades", icon: "leaf-outline",       route: "Propriedades" },
  { label: "Alertas",             icon: "warning-outline",    route: "Alertas" },
  { label: "Relatórios",          icon: "bar-chart-outline",  route: "Relatorios" },
  { label: "Perfil",              icon: "person-outline",     route: "Profile" },
];

export default function SidebarMenu({ navigation, state }: DrawerContentComponentProps) {
  const { logout } = useAuth();
  const activeRoute = state.routes[state.index]?.name;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Ionicons name="planet" size={36} color="#00F5A0" />
        </View>
        <Text style={styles.appName}>AstroFarm</Text>
        <Text style={styles.slogan}>Monitoramento orbital</Text>
      </View>

      <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
        {MENU_ITEMS.map((item) => {
          const isActive = activeRoute === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={isActive ? "#000" : "#A0B4C8"}
                />
              </View>
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
              {isActive && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <View style={styles.logoutIconWrapper}>
            <Ionicons name="log-out-outline" size={20} color="#F44336" />
          </View>
          <Text style={styles.logoutLabel}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060F1E",
  },
  header: {
    alignItems: "center",
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,245,160,0.1)",
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(0,245,160,0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(0,245,160,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  appName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  slogan: {
    color: "#4A6080",
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  menuItems: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: "rgba(0,245,160,0.12)",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconWrapperActive: {
    backgroundColor: "#00F5A0",
  },
  menuLabel: {
    color: "#7A8FA0",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  menuLabelActive: {
    color: "#FFFFFF",
  },
  activeIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#00F5A0",
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(244,67,54,0.07)",
  },
  logoutIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(244,67,54,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoutLabel: {
    color: "#F44336",
    fontSize: 15,
    fontWeight: "600",
  },
});