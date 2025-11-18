// app/gameover.tsx
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GameOver() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useLanguage();

  // Params posibles
  const winnerParam = params.winner as string | undefined;
  const p1Param = params.p1 as string | undefined;
  const p2Param = params.p2 as string | undefined;
  const scoreParam = params.score as string | undefined;

  const p1Score = p1Param ? Number(p1Param) : 0;
  const p2Score = p2Param ? Number(p2Param) : 0;
  const singleScore = scoreParam ? Number(scoreParam) : 0;

  // ¿Fue multijugador o single?
  const isMultiplayer = !!winnerParam && (p1Param !== undefined || p2Param !== undefined);
  const winner = winnerParam ?? t('gameover.singleWinner', 'Jugador');

  // Animaciones
  const scale = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [scale, rotate]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Estrella animada */}
      <Animated.View
        style={[
          styles.starContainer,
          { transform: [{ scale }, { rotate: spin }] },
        ]}
      >
        <Text style={styles.star}>⭐</Text>
      </Animated.View>

      {/* Título principal */}
      <Text style={styles.mainTitle}>
        {isMultiplayer
          ? t('gameover.titleMulti', '¡Juego terminado!')
          : t('gameover.titleSingle', '¡Juego terminado!')}
      </Text>

      {/* Subtítulo según modo */}
      {isMultiplayer ? (
        <Text style={styles.subtitle}>
          🏆 {t('gameover.winner', 'Ganador')}: <Text style={styles.winnerName}>{winner}</Text>
        </Text>
      ) : (
        <Text style={styles.subtitle}>
          🏆 {t('gameover.finalScore', 'Tu puntuación')}:&nbsp;
          <Text style={styles.winnerName}>{singleScore}</Text>
        </Text>
      )}

      {/* Tabla de resultados en multijugador */}
      {isMultiplayer && (
        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <Text style={styles.playerIcon}>👤</Text>
            <Text style={styles.playerName}>Player 1</Text>
            <Text style={styles.playerScore}>🏆 {p1Score}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.scoreRow}>
            <Text style={styles.playerIcon}>👤</Text>
            <Text style={styles.playerName}>Player 2</Text>
            <Text style={styles.playerScore}>🏆 {p2Score}</Text>
          </View>
        </View>
      )}

      {/* Botón de reinicio */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.buttonText}>
          {t('gameover.restart', 'Reiniciar')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  starContainer: {
    marginBottom: 20,
  },
  star: {
    fontSize: 120,
  },
  mainTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
  },
  winnerName: {
    color: '#fff',
    fontWeight: '900',
  },
  scoreCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#FF7043',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 6,
  },
  playerIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#fff',
  },
  playerName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  playerScore: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '800',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#FFD700',
    borderRadius: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
  },
});
