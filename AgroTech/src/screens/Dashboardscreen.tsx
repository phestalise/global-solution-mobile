import React, { useState, useCallback } from "react";
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { useAuth } from "../context/AuthContext";
import { leituraService, alertaService } from "../services/api";
import { DashboardLeitura, Alerta } from "../types";

const calcularRisco = (ndvi: number) => {
  if (ndvi >= 0.6) return { nivel: "BAIXO", cor: "#4CAF50" };
  if (ndvi >= 0.3) return { nivel: "MÉDIO", cor: "#FFC107" };
  return { nivel: "ALTO", cor: "#F44336" };
};

export default function DashboardScreen({ navigation }: any) {
  const { produtor } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardLeitura[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const primeiraLeitura = dashboard[0]?.leitura;
  const risco = calcularRisco(primeiraLeitura?.ndvi ?? 0);

  const buscarDados = useCallback(async () => {
    if (!produtor?.id) return;
    try {
      setErro(null);
      const [dashRes, alertasRes] = await Promise.all([
        leituraService.getDashboard(produtor.id),
        alertaService.listar(produtor.id, true),
      ]);
      setDashboard(dashRes.data);
      setAlertas(alertasRes.data);
    } catch (e: any) {
      setErro(e.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [produtor?.id]);

  React.useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    buscarDados();
  }, [buscarDados]);

  if (loading) {
    return (
      <LinearGradient colors={["#06111F", "#081B33", "#0A223D"]} style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </LinearGradient>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} colors={[Colors.primary]} />
      }
    >
      <LinearGradient colors={["#06111F", "#081B33", "#0A223D"]} style={styles.background}>

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Olá, {produtor?.nome?.split(" ")[0]} 👋</Text>
            {dashboard[0] && (
              <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color={Colors.primary} />
                <Text style={styles.locationText}>{dashboard[0].nome}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {erro && (
          <View style={styles.erroBox}>
            <Ionicons name="warning-outline" size={18} color="#F44336" />
            <Text style={styles.erroText}>{erro}</Text>
          </View>
        )}

        {primeiraLeitura ? (
          <>
            <View style={styles.riscoContainer}>
              <Text style={styles.sectionTitle}>Risco da Lavoura</Text>
              <View style={styles.riscoCard}>
                <View style={[styles.riscoCircle, { borderColor: risco.cor }]}>
                  <Text style={[styles.riscoNivel, { color: risco.cor }]}>{risco.nivel}</Text>
                  <Text style={styles.riscoLabel}>NDVI: {primeiraLeitura.ndvi.toFixed(2)}</Text>
                </View>
                <Text style={styles.riscoDescricao}>
                  {risco.nivel === "BAIXO"
                    ? "Sua lavoura está saudável e com bom desenvolvimento vegetativo."
                    : risco.nivel === "MÉDIO"
                    ? "Atenção: vegetação em estágio moderado, monitore com frequência."
                    : "Alerta: baixa atividade vegetativa, possível estresse hídrico ou praga."}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Métricas em Tempo Real</Text>
            <View style={styles.metricsGrid}>
              <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate("DetalhesPropriedade", { metrica: "temperatura" })} activeOpacity={0.7}>
                <Ionicons name="thermometer" size={28} color="#FF8A65" />
                <Text style={styles.metricValue}>{primeiraLeitura.temperatura.toFixed(1)}°C</Text>
                <Text style={styles.metricLabel}>Temperatura</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${(primeiraLeitura.temperatura / 45) * 100}%`, backgroundColor: "#FF8A65" }]} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate("DetalhesPropriedade", { metrica: "umidade" })} activeOpacity={0.7}>
                <Ionicons name="water" size={28} color="#64B5F6" />
                <Text style={styles.metricValue}>{primeiraLeitura.umidade.toFixed(0)}%</Text>
                <Text style={styles.metricLabel}>Umidade do Solo</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${primeiraLeitura.umidade}%`, backgroundColor: "#64B5F6" }]} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate("DetalhesPropriedade", { metrica: "ndvi" })} activeOpacity={0.7}>
                <Ionicons name="leaf" size={28} color="#81C784" />
                <Text style={styles.metricValue}>{primeiraLeitura.ndvi.toFixed(2)}</Text>
                <Text style={styles.metricLabel}>NDVI</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${primeiraLeitura.ndvi * 100}%`, backgroundColor: "#81C784" }]} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.metricCard} onPress={() => navigation.navigate("DetalhesPropriedade", { metrica: "solo" })} activeOpacity={0.7}>
                <Ionicons name="earth" size={28} color="#FFD54F" />
                <Text style={styles.metricValue}>{primeiraLeitura.statusSolo ?? "—"}</Text>
                <Text style={styles.metricLabel}>Status do Solo</Text>
                {primeiraLeitura.statusSolo && (
                  <View style={[styles.statusBadge, { backgroundColor: primeiraLeitura.statusSolo === "Bom" ? "#4CAF50" : primeiraLeitura.statusSolo === "Regular" ? "#FFC107" : "#F44336" }]}>
                    <Text style={styles.statusBadgeText}>● {primeiraLeitura.statusSolo}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          !erro && (
            <View style={styles.semDados}>
              <Ionicons name="leaf-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.semDadosText}>Nenhuma leitura disponível.</Text>
              <Text style={styles.semDadosSubtext}>Cadastre uma propriedade para começar.</Text>
            </View>
          )
        )}

        {alertas.length > 0 && (
          <View style={styles.alertasSection}>
            <Text style={styles.sectionTitle}>Alertas Recentes</Text>
            {alertas.slice(0, 3).map((alerta) => (
              <TouchableOpacity key={alerta.id} style={styles.alertaItem} onPress={() => navigation.navigate("Alertas")} activeOpacity={0.7}>
                <Ionicons
                  name={alerta.tipo === "praga" ? "bug" : alerta.tipo === "clima" ? "thunderstorm" : "warning"}
                  size={20}
                  color={alerta.gravidade === "alta" ? "#F44336" : "#FFC107"}
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.alertaTexto}>{alerta.mensagem}</Text>
                <Ionicons name="chevron-forward" size={18} color="#7E8A97" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.shortcutsGrid}>
          <TouchableOpacity style={styles.shortcutCard} onPress={() => navigation.navigate("Propriedades")} activeOpacity={0.8}>
            <Ionicons name="grid" size={32} color={Colors.primary} />
            <Text style={styles.shortcutLabel}>Minhas Propriedades</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortcutCard} onPress={() => navigation.navigate("NovaPropriedade")} activeOpacity={0.8}>
            <Ionicons name="add-circle" size={32} color={Colors.primary} />
            <Text style={styles.shortcutLabel}>Nova Propriedade</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortcutCard} onPress={() => navigation.navigate("Profile")} activeOpacity={0.8}>
            <Ionicons name="person" size={32} color={Colors.primary} />
            <Text style={styles.shortcutLabel}>Meu Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortcutCard} onPress={() => navigation.navigate("Alertas")} activeOpacity={0.8}>
            <Ionicons name="warning" size={32} color={Colors.primary} />
            <Text style={styles.shortcutLabel}>Alertas</Text>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#06111F" },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  background: { flex: 1, paddingHorizontal: 20, paddingTop: 60 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: Colors.textMuted, marginTop: 12, fontSize: 15 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  headerLeft: { flex: 1 },
  greeting: { fontSize: 26, fontWeight: "800", color: Colors.text },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  locationText: { color: Colors.textMuted, marginLeft: 4, fontSize: 14 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#10263B", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: Colors.primary },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  erroBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#1a0a0a", borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#F44336" },
  erroText: { color: "#F44336", marginLeft: 8, fontSize: 14, flex: 1 },
  riscoContainer: { marginBottom: 25 },
  riscoCard: { backgroundColor: Colors.card, borderRadius: 24, padding: 20, alignItems: "center", borderWidth: 1, borderColor: Colors.border },
  riscoCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 8, justifyContent: "center", alignItems: "center", marginBottom: 16, backgroundColor: "#0F1A2B" },
  riscoNivel: { fontSize: 28, fontWeight: "900", letterSpacing: 1 },
  riscoLabel: { color: Colors.textMuted, fontSize: 14, marginTop: 4 },
  riscoDescricao: { color: Colors.textMuted, textAlign: "center", fontSize: 14, lineHeight: 20 },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 25 },
  metricCard: { width: "48%", backgroundColor: Colors.card, borderRadius: 20, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: Colors.border, alignItems: "flex-start" },
  metricValue: { color: Colors.text, fontSize: 24, fontWeight: "800", marginTop: 10 },
  metricLabel: { color: Colors.textMuted, fontSize: 13, marginTop: 4 },
  progressBarBg: { width: "100%", height: 4, backgroundColor: "#1E3147", borderRadius: 2, marginTop: 10, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 2 },
  statusBadge: { marginTop: 10, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  alertasSection: { marginBottom: 25 },
  alertaItem: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  alertaTexto: { color: Colors.textMuted, flex: 1, fontSize: 14 },
  shortcutsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  shortcutCard: { width: "48%", backgroundColor: Colors.card, borderRadius: 20, padding: 20, alignItems: "center", justifyContent: "center", marginBottom: 14, borderWidth: 1, borderColor: Colors.border, minHeight: 100 },
  shortcutLabel: { color: Colors.text, fontSize: 14, fontWeight: "600", marginTop: 10, textAlign: "center" },
  semDados: { alignItems: "center", paddingVertical: 40 },
  semDadosText: { color: Colors.text, fontSize: 16, fontWeight: "700", marginTop: 16 },
  semDadosSubtext: { color: Colors.textMuted, fontSize: 14, marginTop: 6 },
});