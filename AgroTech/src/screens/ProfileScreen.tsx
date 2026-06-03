import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }: any) {
  const { produtor, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={52} color={Colors.primary} />
          </View>
          <Text style={styles.name}>{produtor?.nome ?? "—"}</Text>
          <Text style={styles.role}>Produtor Agrícola</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações Pessoais</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="card-outline" size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>CPF</Text>
              <Text style={styles.infoValue}>{produtor?.cpf ?? "—"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="mail-outline" size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{produtor?.email || "Não informado"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>{produtor?.telefone || "Não informado"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="location-outline" size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Localização</Text>
              <Text style={styles.infoValue}>
                {produtor?.cidade && produtor?.estado
                  ? `${produtor.cidade}, ${produtor.estado}`
                  : "Não informado"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate("EditProfile")}
          activeOpacity={0.85}
        >
          <Ionicons name="pencil-outline" size={20} color="#000" style={{ marginRight: 8 }} />
          <Text style={styles.editBtnText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color="#F44336" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Sair da conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: "#060F1E" },
  scroll:       { paddingHorizontal: 20, paddingBottom: 40 },
  avatarSection:{ alignItems: "center", paddingTop: 40, paddingBottom: 32 },
  avatar:       { width: 110, height: 110, borderRadius: 55, backgroundColor: "#0D1B2A", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: Colors.primary, marginBottom: 16 },
  name:         { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },
  role:         { color: "#4A6080", fontSize: 14, marginTop: 4 },
  card:         { backgroundColor: "#0D1B2A", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.07)", marginBottom: 16 },
  cardTitle:    { color: "#FFFFFF", fontSize: 14, fontWeight: "800", marginBottom: 20, letterSpacing: 0.3 },
  infoRow:      { flexDirection: "row", alignItems: "center", gap: 14 },
  infoIconBox:  { width: 38, height: 38, borderRadius: 11, backgroundColor: "rgba(0,245,160,0.08)", borderWidth: 1, borderColor: "rgba(0,245,160,0.15)", justifyContent: "center", alignItems: "center" },
  infoLabel:    { color: "#4A6080", fontSize: 11, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" },
  infoValue:    { color: "#FFFFFF", fontSize: 15, fontWeight: "600", marginTop: 2 },
  divider:      { height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginVertical: 16 },
  editBtn:      { flexDirection: "row", backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  editBtnText:  { color: "#000", fontWeight: "800", fontSize: 15 },
  logoutBtn:    { flexDirection: "row", backgroundColor: "rgba(244,67,54,0.08)", borderRadius: 16, paddingVertical: 16, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(244,67,54,0.2)" },
  logoutBtnText:{ color: "#F44336", fontWeight: "700", fontSize: 15 },
});




