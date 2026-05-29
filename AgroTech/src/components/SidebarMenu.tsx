import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";

// Mapeamento de rotas → ícones e labels
const MENU_ITEMS = [
  { label: "Dashboard", icon: "grid", route: "Dashboard" },
  { label: "Minhas Propriedades", icon: "leaf", route: "Propriedades" },
  { label: "Alertas", icon: "warning", route: "Alertas" },
  { label: "Relatórios", icon: "bar-chart", route: "Relatorios" },
  { label: "Perfil", icon: "person", route: "Profile" },
];

export default function SidebarMenu({ navigation }: DrawerContentComponentProps) {
  return (
    <View style={styles.container}>
      {/* Cabeçalho do menu */}
      <View style={styles.header}>
        <Ionicons name="planet" size={44} color="#00F5A0" />
        <Text style={styles.appName}>AgroTech</Text>
        <Text style={styles.slogan}>Monitoramento orbital</Text>
      </View>

      {/* Itens de navegação */}
      <ScrollView style={styles.menuItems}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon as any} size={22} color="#FFF" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Rodapé com Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          // Aqui você pode chamar o AuthContext para deslogar
          // Ex: authContext.signOut();
          navigation.navigate("Welcome"); // ou navegar para tela de login
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={22} color="#F44336" style={styles.menuIcon} />
        <Text style={[styles.menuLabel, { color: "#F44336" }]}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
    paddingTop: 50,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
    marginBottom: 20,
  },
  appName: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 12,
    letterSpacing: -0.5,
  },
  slogan: {
    color: "#7E8A97",
    fontSize: 13,
    marginTop: 4,
  },
  menuItems: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 6,
    paddingLeft: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  menuIcon: {
    marginRight: 16,
  },
  menuLabel: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 30,
    borderRadius: 14,
    paddingLeft: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
});