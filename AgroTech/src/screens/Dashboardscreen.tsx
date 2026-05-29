import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";

// Dados mockados (futuramente virão da API)
const MOCK_DATA = {
  produtor: "João Silva",
  propriedade: "Fazenda Boa Vista",
  localizacao: "Passo Fundo - RS",
  ndvi: 0.62,        // índice de vegetação (0 a 1)
  temperatura: 27.4, // °C
  umidade: 68,       // %
  statusSolo: "Bom", // "Bom", "Regular", "Crítico"
  alertas: [
    { id: 1, tipo: "praga", mensagem: "Risco de lagarta-do-cartucho detectado", gravidade: "média" },
    { id: 2, tipo: "clima", mensagem: "Previsão de chuva intensa em 48h", gravidade: "baixa" },
  ],
};

// Função para calcular o risco baseado no NDVI
const calcularRisco = (ndvi: number) => {
  if (ndvi >= 0.6) return { nivel: "BAIXO", cor: "#4CAF50" };
  if (ndvi >= 0.3) return { nivel: "MÉDIO", cor: "#FFC107" };
  return { nivel: "ALTO", cor: "#F44336" };
};

export default function DashboardScreen({ navigation }: any) {
  const [dados, setDados] = useState(MOCK_DATA);
  const [refreshing, setRefreshing] = useState(false);
  const risco = calcularRisco(dados.ndvi);

  // Pull‑to‑refresh: simula busca de novos dados
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simular chamada à API (substituir por fetch real)
    setTimeout(() => {
      setDados({
        ...MOCK_DATA,
        ndvi: Math.random() * 0.5 + 0.25,        // novo NDVI entre 0.25 e 0.75
        temperatura: 25 + Math.random() * 8,      // nova temperatura
        umidade: Math.floor(55 + Math.random() * 30), // nova umidade
        statusSolo: ["Bom", "Regular", "Crítico"][Math.floor(Math.random() * 3)],
      });
      setRefreshing(false);
    }, 1200);
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]} // Android
        />
      }
    >
      <LinearGradient
        colors={["#06111F", "#081B33", "#0A223D"]}
        style={styles.background}
      >
        {/* Cabeçalho com saudação */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Olá, {dados.produtor} 👋</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.locationText}>{dados.localizacao}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Indicador de Risco */}
        <View style={styles.riscoContainer}>
          <Text style={styles.sectionTitle}>Risco da Lavoura</Text>
          <View style={styles.riscoCard}>
            <View style={[styles.riscoCircle, { borderColor: risco.cor }]}>
              <Text style={[styles.riscoNivel, { color: risco.cor }]}>
                {risco.nivel}
              </Text>
              <Text style={styles.riscoLabel}>NDVI: {dados.ndvi.toFixed(2)}</Text>
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

        {/* Grid de métricas – agora tocáveis */}
        <Text style={styles.sectionTitle}>Métricas em Tempo Real</Text>
        <View style={styles.metricsGrid}>
          {/* Temperatura */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate("DetalhesPropriedade", { metrica: "temperatura" })}
            activeOpacity={0.7}
          >
            <Ionicons name="thermometer" size={28} color="#FF8A65" />
            <Text style={styles.metricValue}>{dados.temperatura}°C</Text>
            <Text style={styles.metricLabel}>Temperatura</Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${(dados.temperatura / 45) * 100}%`,
                    backgroundColor: "#FF8A65",
                  },
                ]}
              />
            </View>
          </TouchableOpacity>

          {/* Umidade */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate("DetalhesPropriedade", { metrica: "umidade" })}
            activeOpacity={0.7}
          >
            <Ionicons name="water" size={28} color="#64B5F6" />
            <Text style={styles.metricValue}>{dados.umidade}%</Text>
            <Text style={styles.metricLabel}>Umidade do Solo</Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${dados.umidade}%`,
                    backgroundColor: "#64B5F6",
                  },
                ]}
              />
            </View>
          </TouchableOpacity>

          {/* NDVI */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate("DetalhesPropriedade", { metrica: "ndvi" })}
            activeOpacity={0.7}
          >
            <Ionicons name="leaf" size={28} color="#81C784" />
            <Text style={styles.metricValue}>{dados.ndvi.toFixed(2)}</Text>
            <Text style={styles.metricLabel}>NDVI</Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${dados.ndvi * 100}%`,
                    backgroundColor: "#81C784",
                  },
                ]}
              />
            </View>
          </TouchableOpacity>

          {/* Status do Solo */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate("DetalhesPropriedade", { metrica: "solo" })}
            activeOpacity={0.7}
          >
            <Ionicons name="earth" size={28} color="#FFD54F" />
            <Text style={styles.metricValue}>{dados.statusSolo}</Text>
            <Text style={styles.metricLabel}>Status do Solo</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    dados.statusSolo === "Bom"
                      ? "#4CAF50"
                      : dados.statusSolo === "Regular"
                      ? "#FFC107"
                      : "#F44336",
                },
              ]}
            >
              <Text style={styles.statusBadgeText}>● {dados.statusSolo}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Alertas recentes */}
        {dados.alertas.length > 0 && (
          <View style={styles.alertasSection}>
            <Text style={styles.sectionTitle}>Alertas Recentes</Text>
            {dados.alertas.map((alerta) => (
              <TouchableOpacity
                key={alerta.id}
                style={styles.alertaItem}
                onPress={() => navigation.navigate("Alertas")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={alerta.tipo === "praga" ? "bug" : "thunderstorm"}
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

        {/* Atalhos de navegação */}
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.shortcutsGrid}>
          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() => navigation.navigate("Propriedades")}
            activeOpacity={0.8}
          >
            <Ionicons name="grid" size={32} color={Colors.primary} />
            <Text style={styles.shortcutLabel}>Minhas Propriedades</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() => navigation.navigate("NovaPropriedade")}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={32} color={Colors.primary} />
            <Text style={styles.shortcutLabel}>Nova Propriedade</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.8}
          >
            <Ionicons name="person" size={32} color={Colors.primary} />
            <Text style={styles.shortcutLabel}>Meu Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() => navigation.navigate("Alertas")}
            activeOpacity={0.8}
          >
            <Ionicons name="warning" size={32} color={Colors.primary} />
            <Text style={styles.shortcutLabel}>Alertas</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

// Estilos (mantidos exatamente iguais ao original, apenas adicionados alguns detalhes)
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#06111F",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  background: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  locationText: {
    color: Colors.textMuted,
    marginLeft: 4,
    fontSize: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#10263B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  riscoContainer: {
    marginBottom: 25,
  },
  riscoCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  riscoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#0F1A2B",
  },
  riscoNivel: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
  },
  riscoLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  riscoDescricao: {
    color: Colors.textMuted,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  metricCard: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "flex-start",
  },
  metricValue: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 10,
  },
  metricLabel: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  progressBarBg: {
    width: "100%",
    height: 4,
    backgroundColor: "#1E3147",
    borderRadius: 2,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  statusBadge: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  alertasSection: {
    marginBottom: 25,
  },
  alertaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  alertaTexto: {
    color: Colors.textMuted,
    flex: 1,
    fontSize: 14,
  },
  shortcutsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  shortcutCard: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 100,
  },
  shortcutLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
});