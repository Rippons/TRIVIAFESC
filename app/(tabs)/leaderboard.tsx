// app/leaderboard.tsx
import { useLanguage } from '@/contexts/LanguageContext';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  date: string;
}

export default function Leaderboard() {
  const { t, language } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { id: '1', name: 'María García', score: 150, date: '2025-10-08' },
    { id: '2', name: 'Juan Pérez', score: 140, date: '2025-10-07' },
    { id: '3', name: 'Ana López', score: 130, date: '2025-10-06' },
    { id: '4', name: 'Carlos Ruiz', score: 120, date: '2025-10-05' },
    { id: '5', name: 'Laura Martínez', score: 110, date: '2025-10-04' },
    { id: '6', name: 'Pedro Sánchez', score: 100, date: '2025-10-03' },
    { id: '7', name: 'Sofía Torres', score: 90, date: '2025-10-02' },
    { id: '8', name: 'Diego Ramírez', score: 80, date: '2025-10-01' },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // Aquí cargarías los datos desde tu base de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${position + 1}.`;
    }
  };

  // Formatear fecha según el idioma
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locales = {
      es: 'es-ES',
      en: 'en-US',
      pt: 'pt-BR'
    };
    return date.toLocaleDateString(locales[language as keyof typeof locales] || 'es-ES');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('leaderboard.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('leaderboard.subtitle')}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {leaderboard.map((entry, index) => (
          <View
            key={entry.id}
            style={[
              styles.entryCard,
              index < 3 && styles.topThreeCard,
            ]}
          >
            <View style={styles.positionContainer}>
              <Text style={[
                styles.position,
                index < 3 && styles.topThreePosition
              ]}>
                {getMedalEmoji(index)}
              </Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.name}>{entry.name}</Text>
              <Text style={styles.date}>{formatDate(entry.date)}</Text>
            </View>

            <View style={styles.scoreContainer}>
              <Text style={styles.score}>{entry.score}</Text>
              <Text style={styles.scoreLabel}>{t('leaderboard.points')}</Text>
            </View>
          </View>
        ))}

        {leaderboard.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('leaderboard.empty')}</Text>
            <Text style={styles.emptySubtext}>{t('leaderboard.emptySubtitle')}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topThreeCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: '#FFFEF7',
  },
  positionContainer: {
    width: 50,
    alignItems: 'center',
    marginRight: 15,
  },
  position: {
    fontSize: 20,
    fontWeight: '700',
    color: '#666',
  },
  topThreePosition: {
    fontSize: 28,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 3,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  scoreContainer: {
    alignItems: 'flex-end',
    paddingLeft: 15,
  },
  score: {
    fontSize: 24,
    fontWeight: '800',
    color: '#E53935',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: -3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
});