import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { supabase } from "../lib/supabase";

// Configurando o Calendário para Português (Brasil)
LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan.",
    "Fev.",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set.",
    "Out.",
    "Nov.",
    "Dez.",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

export default function HomeScreen() {
  // Estados do Modal e Formulário
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState("");

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<
    "corpo" | "mente" | "bolso" | "estudos" | "roteiros"
  >("corpo");
  const [prioridade, setPrioridade] = useState<"alta" | "media" | "leve">(
    "media",
  );

  // Função para abrir o formulário ao clicar no dia
  function abrirFormulario(dia: string) {
    setDataSelecionada(dia);
    setModalVisivel(true);
  }

  // Função para salvar a tarefa no banco
  async function salvarNovaTarefa() {
    if (!titulo) return alert("Digite um título para a tarefa.");

    const { error } = await supabase.from("tarefas_globais").insert([
      {
        titulo: titulo,
        categoria: categoria,
        prioridade: prioridade,
        data_alvo: dataSelecionada, // A data que veio do clique no calendário
      },
    ]);

    if (!error) {
      // Limpa os campos e fecha o modal
      setTitulo("");
      setCategoria("corpo");
      setPrioridade("media");
      setModalVisivel(false);
      alert("Tarefa adicionada ao calendário!");
    } else {
      console.error(error);
      alert(`Erro ao salvar: ${error.message}`);
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Segundo Cérebro 🧠</Text>

      {/* CALENDÁRIO */}
      <View style={styles.calendarContainer}>
        <Calendar
          theme={{
            backgroundColor: "#1f2937",
            calendarBackground: "#1f2937",
            textSectionTitleColor: "#9ca3af",
            selectedDayBackgroundColor: "#3b82f6",
            dayTextColor: "#ffffff",
            todayTextColor: "#3b82f6",
            monthTextColor: "#ffffff",
            arrowColor: "#ffffff",
            textDayFontWeight: "bold",
            textMonthFontWeight: "bold",
          }}
          onDayPress={(day: any) => abrirFormulario(day.dateString)}
          hideExtraDays={true}
        />
      </View>

      {/* MODAL DE NOVA TAREFA */}
      <Modal animationType="slide" transparent={true} visible={modalVisivel}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Nova Tarefa: {dataSelecionada}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="O que precisa ser feito?"
              placeholderTextColor="#6b7280"
              value={titulo}
              onChangeText={setTitulo}
            />

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.row}>
              {["corpo", "mente", "bolso", "estudos", "roteiros"].map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.btnSelect,
                    categoria === cat && styles.btnSelectAtivo,
                  ]}
                  onPress={() => setCategoria(cat as any)}
                >
                  <Text
                    style={[
                      styles.btnSelectTexto,
                      categoria === cat && styles.btnTextoAtivo,
                    ]}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Prioridade</Text>
            <View style={styles.row}>
              {["alta", "media", "leve"].map((prio) => (
                <Pressable
                  key={prio}
                  style={[
                    styles.btnSelect,
                    prioridade === prio && styles.btnSelectAtivo,
                  ]}
                  onPress={() => setPrioridade(prio as any)}
                >
                  <Text
                    style={[
                      styles.btnSelectTexto,
                      prioridade === prio && styles.btnTextoAtivo,
                    ]}
                  >
                    {prio.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.btnAcao, { backgroundColor: "#374151" }]}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.btnAcaoTexto}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.btnAcao, { backgroundColor: "#3b82f6" }]}
                onPress={salvarNovaTarefa}
              >
                <Text style={styles.btnAcaoTexto}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MÓDULOS */}
      <Text style={styles.sectionTitle}>Seus Módulos</Text>
      <View style={styles.modulosGrid}>
        <Pressable
          style={[styles.cardModulo, { borderLeftColor: "#b91c1c" }]}
          onPress={() => router.push("/corpo")}
        >
          <Text style={styles.cardTitulo}>🔴 Corpo</Text>
          <Text style={styles.cardDesc}>Treinos e Saúde</Text>
        </Pressable>
        <Pressable
          style={[styles.cardModulo, { borderLeftColor: "#eab308" }]}
          onPress={() => router.push("/mente")}
        >
          <Text style={styles.cardTitulo}>🟡 Mente</Text>
          <Text style={styles.cardDesc}>Zettelkasten</Text>
        </Pressable>
        <Pressable
          style={[styles.cardModulo, { borderLeftColor: "#22c55e" }]}
          onPress={() => router.push("/bolso")}
        >
          <Text style={styles.cardTitulo}>🟢 Bolso</Text>
          <Text style={styles.cardDesc}>Finanças</Text>
        </Pressable>
        <Pressable
          style={[styles.cardModulo, { borderLeftColor: "#3b82f6" }]}
          onPress={() => router.push("/estudos")}
        >
          <Text style={styles.cardTitulo}>🔵 Estudos</Text>
          <Text style={styles.cardDesc}>Pomodoro e Foco</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  calendarContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#374151",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9ca3af",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  modulosGrid: { gap: 16, paddingBottom: 40 },
  cardModulo: {
    backgroundColor: "#27272a",
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 6,
    cursor: "pointer",
  },
  cardTitulo: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  cardDesc: { color: "#a1a1aa", fontSize: 14, marginTop: 4 },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#374151",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#374151",
    color: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  label: {
    color: "#9ca3af",
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    fontSize: 12,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  btnSelect: {
    backgroundColor: "#374151",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnSelectAtivo: { backgroundColor: "#eab308" }, // Amarelo de destaque
  btnSelectTexto: { color: "#9ca3af", fontWeight: "bold" },
  btnTextoAtivo: { color: "#121212" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  btnAcao: { flex: 1, padding: 16, borderRadius: 8, alignItems: "center" },
  btnAcaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
