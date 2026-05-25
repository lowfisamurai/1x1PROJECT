import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function CorpoScreen() {
  const [treinos, setTreinos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaCarga, setNovaCarga] = useState("");

  async function buscarTreinos() {
    setLoading(true);
    const { data, error } = await supabase
      .from("treinos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTreinos(data);
    }
    setLoading(false);
  }

  async function salvarTreino() {
    if (!novoTitulo || !novaCarga) return;

    const cargaNumerica = parseInt(novaCarga, 10);
    const { error } = await supabase.from("treinos").insert([
      {
        titulo: novoTitulo,
        carga_total_levantada: cargaNumerica,
        status_concluido: true,
      },
    ]);

    if (!error) {
      setNovoTitulo("");
      setNovaCarga("");
      buscarTreinos();
    }
  }

  useEffect(() => {
    buscarTreinos();
  }, []);

  // --- LÓGICA DE GAMIFICAÇÃO (ELO) ---

  // 1. Soma todo o peso já levantado no histórico
  const volumeTotal = useMemo(() => {
    return treinos.reduce(
      (soma, treino) => soma + (treino.carga_total_levantada || 0),
      0,
    );
  }, [treinos]);

  // 2. Define os limites de cada ELO
  const eloAtual = useMemo(() => {
    if (volumeTotal >= 500000)
      return { nome: "Diamante 💎", min: 500000, max: 1000000, cor: "#0ea5e9" };
    if (volumeTotal >= 250000)
      return { nome: "Platina 💠", min: 250000, max: 500000, cor: "#14b8a6" };
    if (volumeTotal >= 100000)
      return { nome: "Ouro 🥇", min: 100000, max: 250000, cor: "#eab308" };
    if (volumeTotal >= 50000)
      return { nome: "Prata 🥈", min: 50000, max: 100000, cor: "#9ca3af" };
    return { nome: "Bronze 🥉", min: 0, max: 50000, cor: "#b45309" };
  }, [volumeTotal]);

  // 3. Calcula a porcentagem para a barra visual (0% a 100%)
  const progressoPorcentagem = Math.min(
    Math.max(
      ((volumeTotal - eloAtual.min) / (eloAtual.max - eloAtual.min)) * 100,
      0,
    ),
    100,
  );

  return (
    <View style={styles.container}>
      {/* CABEÇALHO GAMIFICADO */}
      <View style={styles.headerScore}>
        <Text style={styles.eloTitulo}>
          ELO Atual:{" "}
          <Text style={{ color: eloAtual.cor }}>{eloAtual.nome}</Text>
        </Text>
        <Text style={styles.volumeTexto}>
          Volume Acumulado: {volumeTotal} kg
        </Text>

        {/* Barra de Progresso */}
        <View style={styles.barraFundo}>
          <View
            style={[
              styles.barraPreenchida,
              {
                width: `${progressoPorcentagem}%`,
                backgroundColor: eloAtual.cor,
              },
            ]}
          />
        </View>
        <Text style={styles.progressoTexto}>
          {Math.floor(progressoPorcentagem)}% para o próximo ELO
        </Text>
      </View>

      {/* FORMULÁRIO */}
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>Registrar Novo Treino</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Peito e Tríceps"
          placeholderTextColor="#6b7280"
          value={novoTitulo}
          onChangeText={setNovoTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Carga total (kg)"
          placeholderTextColor="#6b7280"
          keyboardType="numeric"
          value={novaCarga}
          onChangeText={setNovaCarga}
        />
        <TouchableOpacity
          style={styles.btnSalvar}
          onPress={salvarTreino}
          activeOpacity={0.8}
        >
          <Text style={styles.btnTexto}>Salvar Treino</Text>
        </TouchableOpacity>
      </View>

      {/* HISTÓRICO */}
      <Text style={styles.historicoLabel}>Histórico de Treinos</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#b91c1c"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={treinos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.cardTreino}>
              <Text style={styles.treinoTitulo}>{item.titulo}</Text>
              <Text style={styles.treinoCarga}>
                Volume: {item.carga_total_levantada} kg
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 40,
  },

  // Estilos da Gamificação
  headerScore: {
    backgroundColor: "#1f2937",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  eloTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  volumeTexto: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 16,
  },
  barraFundo: {
    height: 12,
    backgroundColor: "#374151",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  barraPreenchida: { height: "100%", borderRadius: 6 },
  progressoTexto: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "right",
    fontWeight: "bold",
  },

  formContainer: {
    backgroundColor: "#1f2937",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  formLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#374151",
    color: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  btnSalvar: {
    backgroundColor: "#b91c1c",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  historicoLabel: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  cardTreino: {
    backgroundColor: "#27272a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#b91c1c",
  },
  treinoTitulo: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  treinoCarga: { color: "#a1a1aa", fontSize: 14, marginTop: 4 },
});
