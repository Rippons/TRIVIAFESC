// app/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trivia FESC</Text>
      <Text style={styles.subtitle}>Gira la ruleta y responde preguntas por categoría</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/game')}>
        <Text style={styles.buttonText}>Iniciar Juego</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Vidas: 3 • ¡Buena suerte!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FFF7' },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 8 },
  subtitle: { textAlign: 'center', color: '#444', marginBottom: 24 },
  button: { backgroundColor: '#E53935', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  footer: { marginTop: 20, color: '#666' },
});
