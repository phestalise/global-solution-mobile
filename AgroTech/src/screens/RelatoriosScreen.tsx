import React, { useState, useCallback } from "react";
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl, Modal, Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { useAuth } from "../context/AuthContext";
import { leituraService, propriedadeService } from "../services/api";

export default function RelatoriosScreen() {
  const { produtor } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [propriedades, setPropriedades] = useState<any[]>([]);
  const [leituras, setLeituras] = useState<Record<number, any[]>>({});
  const [erro, setErro] = useState<string | null>(null);

  // Expandir histórico completo
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [leiturasCompletas, setLeiturasCompletas] = useState<Record<number, any[]>>({});
  const [carregandoMais, setCarregandoMais] = useState<Record<number, boolean>>({});

  // Modal de detalhes
  const [leituraSelecionada, setLeituraSelecionada] = useState<any>(null);

  // Ordenação das leituras
  const [ordem, setOrdem] = useState<"data" | "ndvi">("data");

  const buscarDados = useCallback(async () => {
    if (!produtor?.id) return;
    try {
      setErro(null);
      const propRes = await propriedadeService.listar(produtor.id);
      const props = propRes.data;
      setPropriedades(props);

      const leiturasMap: Record<number, any[]> = {};
      await Promise.all(
        props.map(async (p: any) => {
          const propId = p.id ?? p.Id;
          try {
            const res = await leituraService.listar(propId, 5);
            leiturasMap[propId] = res.data;
          } catch {
            leiturasMap[propId] = [];
          }
        })
      );
      setLeituras(leiturasMap);
      setExpanded({});
      setLeiturasCompletas({});
    } catch (e: any) {
      setErro(e.message || "Erro ao carregar relatórios.");
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

  const calcRisco = (ndvi: number) => {
    if (ndvi >= 0.6) return { label: "BAIXO", cor: "#4CAF50" };
    if (ndvi >= 0.3) return { label: "MÉDIO", cor: "#FFC107" };
    return { label: "ALTO", cor: "#F44336" };
  };

  const carregarHistoricoCompleto = async (propId: number) => {
    if (carregandoMais[propId]) return;
    setCarregandoMais((prev) => ({ ...prev, [propId]: true }));
    try {
      const res = await leituraService.listar(propId, 100);
      setLeiturasCompletas((prev) => ({ ...prev, [propId]: res.data }));
      setExpanded((prev) => ({ ...prev, [propId]: true }));
    } catch (e) {
      setExpanded((prev) => ({ ...prev, [propId]: true }));
    } finally {
      setCarregandoMais((prev) => ({ ...prev, [propId]: false }));
    }
  };

  // FUNÇÃO REAL – chama POST /api/leituras
  const realizarPrimeiraLeitura = async (propId: number) => {
    try {
      const payload = {
        idPropriedade: propId,
        ndvi: 0.45 + Math.random() * 0.3,      // simula um NDVI aleatório
        temperatura: 24 + Math.random() * 6,
        umidade: 55 + Math.random() * 20,
        fonteSatelite: "app",
      };
      const response = await leituraService.criar(payload);
      const novaLeitura = response.data;

      setLeituras((prev) => ({
        ...prev,
        [propId]: [novaLeitura, ...(prev[propId] || [])],
      }));
    } catch (error) {
      console.error("Erro ao criar leitura", error);
      setErro("Falha ao realizar leitura. Tente novamente.");
    }
  };

  const compartilharPropriedade = async (prop: any, lista: any[]) => {
    const nome = prop.nomeFazenda ?? prop.NomeFazenda ?? "Propriedade";
    const linhas = lista.map((l) => {
      const data = new Date(l.dataLeitura).toLocaleDateString("pt-BR");
      const ndvi = l.ndvi.toFixed(2);
      const temp = l.temperatura.toFixed(1);
      const umid = l.umidade.toFixed(0);
      return `${data}: NDVI ${ndvi}, ${temp}°C, ${umid}%`;
    }).join("\n");
    await Share.share({
      message: `Relatório de ${nome}\n\n${linhas}`,
      title: `Relatório ${nome}`,
    });
  };

  const ordenarLeituras = (lista: any[]) => {
    if (!lista) return [];
    return [...lista].sort((a, b) => {
      if (ordem === "data") {
        return new Date(b.dataLeitura).getTime() - new Date(a.dataLeitura).getTime();
      } else {
        return (b.ndvi ?? 0) - (a.ndvi ?? 0);
      }
    });
  };

  if (loading) {
    return (
      <LinearGradient colors={["#06111F", "#081B33", "#0A223D"]} style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando relatórios...</Text>
      </LinearGradient>
    );
  }

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
          colors={[Colors.primary]}
        />
      }
    >
      <LinearGradient colors={["#06111F", "#081B33", "#0A223D"]} style={styles.background}>
        <Text style={styles.pageTitle}>Relatórios</Text>
        <Text style={styles.pageSubtitle}>Histórico de leituras por propriedade</Text>

        {erro && (
          <View style={styles.erroBox}>
            <Ionicons name="warning-outline" size={18} color="#F44336" />
            <Text style={styles.erroText}>{erro}</Text>
          </View>
        )}

        {propriedades.length === 0 && !erro && (
          <View style={styles.semDados}>
            <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.semDadosText}>Nenhuma propriedade cadastrada.</Text>
          </View>
        )}

        {propriedades.map((prop) => {
          const id = prop.id ?? prop.Id;
          const nome = prop.nomeFazenda ?? prop.NomeFazenda ?? "Propriedade";
          const listaOriginal = expanded[id]
            ? leiturasCompletas[id] ?? []
            : leituras[id] ?? [];
          const lista = ordenarLeituras(listaOriginal);
          const ultimoNdvi = lista.length > 0 ? lista[0].ndvi : undefined;
          const riscoAtual = ultimoNdvi !== undefined ? calcRisco(ultimoNdvi) : null;
          const isAlerta = riscoAtual?.label === "ALTO";

          const miniLista = [...(leituras[id] ?? [])]
            .sort((a, b) => new Date(a.dataLeitura).getTime() - new Date(b.dataLeitura).getTime())
            .slice(-5);
          const ndviValues = miniLista.map((l: any) => l.ndvi ?? 0);

          return (
            <View key={id} style={[styles.card, isAlerta && styles.cardAlerta]}>
              <View style={styles.cardHeader}>
                <Ionicons name="leaf" size={20} color={Colors.primary} />
                <Text style={styles.cardTitle} numberOfLines={1}>{nome}</Text>
                {riscoAtual && (
                  <View style={[styles.badge, { backgroundColor: riscoAtual.cor + "22", borderColor: riscoAtual.cor }]}>
                    <Ionicons name="warning" size={12} color={riscoAtual.cor} />
                    <Text style={[styles.badgeText, { color: riscoAtual.cor }]}>{riscoAtual.label}</Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => compartilharPropriedade(prop, lista)}
                  style={styles.shareButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="share-outline" size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              {ndviValues.length > 0 && (
                <View style={styles.miniChart}>
                  <Text style={styles.miniChartTitle}>Evolução NDVI</Text>
                  <View style={styles.barContainer}>
                    {ndviValues.map((val, i) => {
                      const altura = Math.max(8, val * 40);
                      const cor = val >= 0.6 ? "#4CAF50" : val >= 0.3 ? "#FFC107" : "#F44336";
                      return (
                        <View key={i} style={styles.barWrapper}>
                          <View style={[styles.bar, { height: altura, backgroundColor: cor }]} />
                          <Text style={styles.barLabel}>{i + 1}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {lista.length === 0 ? (
                <View style={styles.semLeituraContainer}>
                  <Ionicons name="cloud-offline-outline" size={32} color={Colors.textMuted} />
                  <Text style={styles.semLeituraText}>Nenhuma leitura ainda</Text>
                  <TouchableOpacity
                    style={styles.primeiraLeituraBtn}
                    onPress={() => realizarPrimeiraLeitura(id)}
                  >
                    <Ionicons name="add-circle-outline" size={18} color="#FFF" />
                    <Text style={styles.primeiraLeituraBtnText}>Realizar 1ª leitura</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.tableHeader}>
                    <TouchableOpacity
                      style={styles.tableCellHeader}
                      onPress={() => setOrdem("data")}
                    >
                      <Text style={[styles.tableHead, ordem === "data" && styles.tableHeadActive]}>Data</Text>
                      {ordem === "data" && <Ionicons name="caret-down" size={10} color={Colors.primary} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.tableCellHeader}
                      onPress={() => setOrdem("ndvi")}
                    >
                      <Text style={[styles.tableHead, ordem === "ndvi" && styles.tableHeadActive]}>NDVI</Text>
                      {ordem === "ndvi" && <Ionicons name="caret-down" size={10} color={Colors.primary} />}
                    </TouchableOpacity>
                    <Text style={[styles.tableCell, styles.tableHead]}>Temp.</Text>
                    <Text style={[styles.tableCell, styles.tableHead]}>Umid.</Text>
                    <Text style={[styles.tableCell, styles.tableHead]}>Risco</Text>
                  </View>

                  {lista.map((l, i) => {
                    const risco = calcRisco(l.ndvi ?? 0);
                    const data = new Date(l.dataLeitura).toLocaleDateString("pt-BR");
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}
                        onPress={() => setLeituraSelecionada(l)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.tableCell}>{data}</Text>
                        <Text style={styles.tableCell}>{l.ndvi.toFixed(2)}</Text>
                        <Text style={styles.tableCell}>{l.temperatura.toFixed(1)}°</Text>
                        <Text style={styles.tableCell}>{l.umidade.toFixed(0)}%</Text>
                        <Text style={[styles.tableCell, { color: risco.cor, fontWeight: "700" }]}>{risco.label}</Text>
                      </TouchableOpacity>
                    );
                  })}

                  {!expanded[id] && leituras[id]?.length === 5 && (
                    <TouchableOpacity
                      style={styles.verMaisBtn}
                      onPress={() => carregarHistoricoCompleto(id)}
                      disabled={carregandoMais[id]}
                    >
                      {carregandoMais[id] ? (
                        <ActivityIndicator size="small" color={Colors.primary} />
                      ) : (
                        <>
                          <Text style={styles.verMaisText}>Ver histórico completo</Text>
                          <Ionicons name="chevron-down" size={16} color={Colors.primary} />
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          );
        })}
      </LinearGradient>

      <Modal
        visible={!!leituraSelecionada}
        transparent
        animationType="slide"
        onRequestClose={() => setLeituraSelecionada(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes da Leitura</Text>
              <TouchableOpacity onPress={() => setLeituraSelecionada(null)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {leituraSelecionada && (
              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Data:</Text>
                <Text style={styles.modalValue}>
                  {new Date(leituraSelecionada.dataLeitura).toLocaleString("pt-BR")}
                </Text>

                <View style={styles.modalRow}>
                  <View style={styles.modalItem}>
                    <Text style={styles.modalLabel}>NDVI</Text>
                    <Text style={[styles.modalValueBig, { color: calcRisco(leituraSelecionada.ndvi).cor }]}>
                      {leituraSelecionada.ndvi.toFixed(2)}
                    </Text>
                    <Text style={styles.riskText}>{calcRisco(leituraSelecionada.ndvi).label}</Text>
                  </View>
                  <View style={styles.modalItem}>
                    <Text style={styles.modalLabel}>Temperatura</Text>
                    <Text style={styles.modalValueBig}>{leituraSelecionada.temperatura.toFixed(1)}°C</Text>
                  </View>
                  <View style={styles.modalItem}>
                    <Text style={styles.modalLabel}>Umidade</Text>
                    <Text style={styles.modalValueBig}>{leituraSelecionada.umidade.toFixed(0)}%</Text>
                  </View>
                </View>

                {leituraSelecionada.statusSolo && (
                  <View style={styles.modalStatusRow}>
                    <Text style={styles.modalLabel}>Status do Solo:</Text>
                    <Text style={styles.modalValue}>{leituraSelecionada.statusSolo}</Text>
                  </View>
                )}

                <View style={styles.modalMapPlaceholder}>
                  <Ionicons name="map-outline" size={32} color={Colors.textMuted} />
                  <Text style={styles.modalPlaceholderText}>Visualização do talhão</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#06111F" },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  background: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: Colors.textMuted, marginTop: 12, fontSize: 15 },
  pageTitle: { color: Colors.text, fontSize: 28, fontWeight: "900", marginBottom: 4 },
  pageSubtitle: { color: Colors.textMuted, fontSize: 14, marginBottom: 24 },
  erroBox: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#1a0a0a",
    borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#F44336",
  },
  erroText: { color: "#F44336", marginLeft: 8, fontSize: 14, flex: 1 },
  semDados: { alignItems: "center", paddingVertical: 60 },
  semDadosText: { color: Colors.textMuted, fontSize: 15, marginTop: 16 },
  card: {
    backgroundColor: Colors.card, borderRadius: 20, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: Colors.border,
  },
  cardAlerta: {
    borderColor: "#F44336",
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: "row", alignItems: "center", marginBottom: 14,
  },
  cardTitle: { color: Colors.text, fontSize: 16, fontWeight: "700", marginLeft: 8, flex: 1 },
  badge: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12,
    borderWidth: 1, marginRight: 8,
  },
  badgeText: { fontSize: 11, fontWeight: "700", marginLeft: 4 },
  shareButton: { padding: 4 },
  miniChart: { marginBottom: 14 },
  miniChartTitle: { color: Colors.textMuted, fontSize: 12, marginBottom: 8 },
  barContainer: { flexDirection: "row", alignItems: "flex-end", height: 50 },
  barWrapper: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  bar: { width: 8, borderRadius: 4, marginHorizontal: 2 },
  barLabel: { color: Colors.textMuted, fontSize: 9, marginTop: 4 },
  tableHeader: {
    flexDirection: "row", borderBottomWidth: 1,
    borderBottomColor: Colors.border, paddingBottom: 8, marginBottom: 4,
  },
  tableRow: { flexDirection: "row", paddingVertical: 8 },
  tableRowAlt: { backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 8 },
  tableCell: { flex: 1, color: Colors.textMuted, fontSize: 12, textAlign: "center" },
  tableCellHeader: {
    flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center",
  },
  tableHead: { color: Colors.text, fontWeight: "700", fontSize: 12 },
  tableHeadActive: { color: Colors.primary },
  verMaisBtn: {
    flexDirection: "row", justifyContent: "center", alignItems: "center",
    paddingVertical: 10, marginTop: 6,
  },
  verMaisText: { color: Colors.primary, fontSize: 13, marginRight: 4 },
  semLeituraContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  semLeituraText: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  primeiraLeituraBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primeiraLeituraBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 20,
  },
  modalTitle: { color: Colors.text, fontSize: 18, fontWeight: "700" },
  modalContent: {},
  modalLabel: { color: Colors.textMuted, fontSize: 13, marginBottom: 2 },
  modalValue: { color: Colors.text, fontSize: 15, marginBottom: 12 },
  modalValueBig: { fontSize: 24, fontWeight: "700", color: Colors.text },
  riskText: { fontSize: 14, fontWeight: "600", marginTop: 2 },
  modalRow: {
    flexDirection: "row", justifyContent: "space-between",
    marginBottom: 20,
  },
  modalItem: { alignItems: "center" },
  modalStatusRow: { flexDirection: "row", marginBottom: 12 },
  modalMapPlaceholder: {
    height: 120, backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12, justifyContent: "center", alignItems: "center",
  },
  modalPlaceholderText: { color: Colors.textMuted, fontSize: 13, marginTop: 8 },
});