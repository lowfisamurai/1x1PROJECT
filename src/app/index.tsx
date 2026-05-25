import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const MODULOS = [
  {
    id: "corpo",
    titulo: "🔴 Corpo",
    cor: "#b91c1c",
    subtitulo: "Treinos, Progressão e ELO",
  },
  {
    id: "mente",
    titulo: "🟡 Mente",
    cor: "#eab308",
    subtitulo: "Journal, Projetos e Notas",
  },
  {
    id: "bolso",
    titulo: "🟢 Bolso",
    cor: "#16a34a",
    subtitulo: "Finanças, Gastos e Metas",
  },
  {
    id: "estudos",
    titulo: "🔵 Estudos",
    cor: "#2563eb",
    subtitulo: "Pomodoro e Matérias",
  },
  {
    id: "roteiros",
    titulo: "🟣 Roteiros",
    cor: "#4f46e5",
    subtitulo: "Sincronização com Notion",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.saudacao}>Segundo Cérebro</Text>
        <Text style={styles.subtituloHeader}>
          Selecione o módulo para iniciar
        </Text>
      </View>

      <View style={styles.grid}>
        {MODULOS.map((modulo) => (
          <Pressable
            key={modulo.id}
            style={[styles.card, { backgroundColor: modulo.cor }]}
            onPress={() => router.push(`/${modulo.id}`)}
          >
            <Text style={styles.cardTitulo}>{modulo.titulo}</Text>
            <Text style={styles.cardSubtitulo}>{modulo.subtitulo}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  saudacao: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtituloHeader: {
    fontSize: 16,
    color: "#a1a1aa",
    marginTop: 4,
  },
  grid: {
    gap: 16, // Espaçamento entre os cards
  },
  card: {
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    minHeight: 110,
    justifyContent: "center",
  },
  cardTitulo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  cardSubtitulo: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 6,
    fontWeight: "500",
  },
});
