// app/gameover.tsx
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GameOver() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const score = Number(params.score ?? 0);
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('gameover.title')}</Text>
      <Text style={styles.score}>{t('gameover.finalScore')}: {score}</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>{t('gameover.restart')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FDEDEC' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 10,
    color: '#333',
  },
  score: { 
    fontSize: 20, 
    marginBottom: 20,
    color: '#555',
  },
  button: { 
    backgroundColor: '#2E86C1', 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 8 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18,
    fontWeight: '600',
  },
});