// app/index.tsx
import GameModeSelector from '@/components/GameModeSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const [showModeSelector, setShowModeSelector] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.title')}</Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setShowModeSelector(true)}
      >
        <Text style={styles.buttonText}>{t('home.startButton')}</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>{t('home.footer')}</Text>

      <GameModeSelector 
        visible={showModeSelector}
        onClose={() => setShowModeSelector(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F7FFF7' 
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    marginBottom: 8,
    color: '#333',
  },
  subtitle: { 
    textAlign: 'center', 
    color: '#444', 
    marginBottom: 24,
    fontSize: 16,
  },
  button: { 
    backgroundColor: '#E53935', 
    paddingVertical: 14, 
    paddingHorizontal: 28, 
    borderRadius: 10 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  footer: { 
    marginTop: 20, 
    color: '#666',
    fontSize: 14,
  },
});