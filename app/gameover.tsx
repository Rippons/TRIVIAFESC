// app/gameover.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function GameOver() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const score = Number(params.score ?? 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Juego terminado!</Text>
      <Text style={styles.score}>Puntaje final: {score}</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>Reiniciar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDEDEC' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 10 },
  score: { fontSize: 20, marginBottom: 20 },
  button: { backgroundColor: '#2E86C1', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18 },
});
