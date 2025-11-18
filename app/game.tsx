// app/game.tsx
import CategoryWheel from '@/components/CategoryWheel';
import Hearts from '@/components/Hearts';
import QuestionCard from '@/components/QuestionCard';
import TurnIndicator from '@/components/TurnIndicator';
import { useLanguage } from '@/contexts/LanguageContext';
import BluetoothService, { GameMessage } from '@/services/BluetoothService';
import { QUESTIONS, Question } from '@/src/data/questions';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

type PlayerKey = 'p1' | 'p2';

/* ─────────────────────────────
   Componente raíz: decide modo
   ───────────────────────────── */
export default function Game() {
  const params = useLocalSearchParams();
  const mode = params.mode ?? 'single';

  if (mode === 'multi') {
    return <MultiGame />;
  }

  return <SingleGame />;
}

/* ─────────────────────────────
   MODO SINGLE PLAYER
   ───────────────────────────── */
function SingleGame() {
  const router = useRouter();
  const { t } = useLanguage();

  const categories = useMemo(() => Object.keys(QUESTIONS), []);

  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [showFeedback, setShowFeedback] = useState<{
    type: 'correct' | 'incorrect' | null;
    message: string;
  }>({ type: null, message: '' });

  const getTranslatedCategory = useCallback(
    (category: string) => {
      const categoryKey = `categories.${category}`;
      const translated = t(categoryKey);
      return translated !== categoryKey ? translated : category;
    },
    [t]
  );

  const selectQuestionFromCategory = useCallback(
    (category: string) => {
      const pool = QUESTIONS[category] ?? [];
      const available = pool.filter((q) => !usedIds.has(q.id));

      if (available.length === 0) {
        Alert.alert(
          t('game.noMoreQuestions'),
          t('game.noMoreQuestionsMessage'),
          [
            {
              text: t('common.ok'),
              onPress: () => {
                setCurrentCategory(null);
                setCurrentQuestion(null);
              },
            },
          ]
        );
        return;
      }

      const q = available[Math.floor(Math.random() * available.length)];
      setCurrentQuestion(q);
    },
    [usedIds, t]
  );

  // Si las vidas llegan a 0 → redirigir a Game Over
  useEffect(() => {
    if (lives <= 0) {
      router.replace({ pathname: '/gameover', params: { score } });
    }
  }, [lives, router, score]);

  // Cuando cambia la categoría, cargamos una pregunta
  useEffect(() => {
    if (currentCategory) {
      selectQuestionFromCategory(currentCategory);
    }
  }, [currentCategory, selectQuestionFromCategory]);

  const handleSelectCategory = (cat: string) => {
    setCurrentCategory(cat);
    setShowFeedback({ type: null, message: '' });
  };

  const handleAnswer = (option: string) => {
    if (!currentQuestion) return;

    const correct = option === currentQuestion.answer;

    if (correct) {
      const newScore = score + 10;
      setScore(newScore);

      setUsedIds((prev) => {
        const updated = new Set(prev).add(currentQuestion.id);
        return updated;
      });

      setShowFeedback({
        type: 'correct',
        message: t('game.correctFeedback'),
      });

      const totalQuestions = Object.values(QUESTIONS).flat().length;

      if (usedIds.size + 1 >= totalQuestions) {
        setTimeout(() => {
          router.replace({ pathname: '/gameover', params: { score: newScore } });
        }, 2000);
        return;
      }

      setTimeout(() => {
        setCurrentCategory(null);
        setCurrentQuestion(null);
        setShowFeedback({ type: null, message: '' });
      }, 2000);
    } else {
      setShowFeedback({
        type: 'incorrect',
        message: `${t('game.incorrectFeedback')} ${currentQuestion.answer}`,
      });

      setLives((l) => l - 1);

      setTimeout(() => {
        setCurrentCategory(null);
        setCurrentQuestion(null);
        setShowFeedback({ type: null, message: '' });
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra de stats para 1 jugador */}
      <View style={styles.statsBar}>
        <View style={styles.playerBox}>
          <Text style={styles.playerLabel}>Tú</Text>
          <Hearts lives={lives} />
          <Text style={styles.scoreText}>
            🏆 {t('game.score')}: {score}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {showFeedback.type && (
          <View
            style={[
              styles.feedbackContainer,
              showFeedback.type === 'correct'
                ? styles.feedbackCorrect
                : styles.feedbackIncorrect,
            ]}
          >
            <Text style={styles.feedbackText}>
              {showFeedback.type === 'correct' ? '🎉' : '😞'} {showFeedback.message}
            </Text>
          </View>
        )}

        {!currentCategory && !showFeedback.type && (
          <CategoryWheel categories={categories} onSelect={handleSelectCategory} />
        )}

        {currentCategory && !showFeedback.type && (
          <View style={styles.categoryBox}>
            <Text style={styles.categoryIcon}>🎯</Text>
            <Text style={styles.categoryText}>
              {t('game.category')}: {getTranslatedCategory(currentCategory)}
            </Text>
          </View>
        )}

        {currentQuestion && !showFeedback.type ? (
          <QuestionCard
            item={currentQuestion}
            onAnswer={handleAnswer}
            category={currentCategory || 'Ingenieria'}
          />
        ) : !showFeedback.type ? (
          <View style={styles.center}>
            <Text style={styles.centerText}>
              {currentCategory ? t('game.loading') : t('game.spinWheel')}
            </Text>
          </View>
        ) : null}

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {t('game.questionsAnswered')}: {usedIds.size} /{' '}
            {Object.values(QUESTIONS).flat().length}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ─────────────────────────────
   MODO MULTIPLAYER
   ───────────────────────────── */
function MultiGame() {
  const router = useRouter();
  const { t } = useLanguage();

  const categories = useMemo(() => Object.keys(QUESTIONS), []);
  const isHost = BluetoothService.isHostDevice();
  const myPlayerNumber = isHost ? 1 : 2;

  const [currentTurn, setCurrentTurn] = useState<number>(1);
  const [lives, setLives] = useState<{ p1: number; p2: number }>({ p1: 3, p2: 3 });
  const [score, setScore] = useState<{ p1: number; p2: number }>({ p1: 0, p2: 0 });
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showFeedback, setShowFeedback] = useState<{
    type: 'correct' | 'incorrect' | null;
    message: string;
  }>({ type: null, message: '' });

  const [showTurnAnim, setShowTurnAnim] = useState(false);

  const pickQuestion = useCallback((category: string): Question => {
    const pool = QUESTIONS[category];
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  const hostSelectCategory = (category: string) => {
    const q = pickQuestion(category);

    BluetoothService.sendMessage({
      type: 'CATEGORY_SELECTED',
      category,
    });

    setCurrentCategory(category);
    setCurrentQuestion(q);
  };

  const handleRemoteMessage = useCallback(
    (msg: GameMessage) => {
      switch (msg.type) {
        case 'CATEGORY_SELECTED': {
          const newQ = pickQuestion(msg.category);
          setCurrentCategory(msg.category);
          setCurrentQuestion(newQ);
          break;
        }

        case 'ANSWER_SUBMITTED': {
          const otherKey: PlayerKey = currentTurn === 1 ? 'p1' : 'p2';
          const myKey: PlayerKey = currentTurn === 1 ? 'p2' : 'p1';
          const correct = msg.isCorrect;

          if (correct) {
            setScore((s) => ({ ...s, [otherKey]: s[otherKey] + 10 }));
          } else {
            setLives((l) => ({ ...l, [otherKey]: l[otherKey] - 1 }));
          }

          if (lives[otherKey] - (correct ? 0 : 1) <= 0) {
            const winner = myKey === 'p1' ? 'Player 1' : 'Player 2';

            BluetoothService.sendMessage({
              type: 'GAME_OVER',
              winner,
              scores: { player1: score.p1, player2: score.p2 },
            });

            router.replace({
              pathname: '/gameover',
              params: { winner },
            });
            return;
          }

          const nextTurn = myKey === 'p1' ? 1 : 2;
          setCurrentTurn(nextTurn);

          setTimeout(() => {
            setCurrentCategory(null);
            setCurrentQuestion(null);
            setShowFeedback({ type: null, message: '' });
          }, 2000);
          break;
        }

        case 'TURN_CHANGED':
          setCurrentTurn(msg.currentPlayer);
          break;

        case 'GAME_OVER':
          router.replace({
            pathname: '/gameover',
            params: {
              winner: msg.winner,
              p1: msg.scores.player1,
              p2: msg.scores.player2,
            },
          });
          break;
      }
    },
    [currentTurn, lives, score, pickQuestion, router]
  );

  useEffect(() => {
    BluetoothService.onMessageReceived(handleRemoteMessage);
    return () => BluetoothService.onMessageReceived(() => {});
  }, [handleRemoteMessage]);

  useEffect(() => {
    setShowTurnAnim(true);
    const id = setTimeout(() => setShowTurnAnim(false), 1800);
    return () => clearTimeout(id);
  }, [currentTurn]);

  const handleSelectCategory = (category: string) => {
    if (!isHost) return;

    hostSelectCategory(category);
  };

  const handleAnswer = (option: string) => {
    if (!currentQuestion) return;

    const key: PlayerKey = myPlayerNumber === 1 ? 'p1' : 'p2';
    const correct = option === currentQuestion.answer;

    if (currentTurn !== myPlayerNumber) {
      Alert.alert('No es tu turno');
      return;
    }

    BluetoothService.sendMessage({
      type: 'ANSWER_SUBMITTED',
      answer: option,
      isCorrect: correct,
      score: 0,
    });

    if (correct) {
      setScore((s) => ({ ...s, [key]: s[key] + 10 }));
      setShowFeedback({ type: 'correct', message: t('game.correctFeedback') });
    } else {
      setLives((l) => ({ ...l, [key]: l[key] - 1 }));
      setShowFeedback({
        type: 'incorrect',
        message: `${t('game.incorrectFeedback')} ${currentQuestion.answer}`,
      });
    }

    if (lives[key] - (correct ? 0 : 1) <= 0) {
      const winner = myPlayerNumber === 1 ? 'Player 2' : 'Player 1';

      if (isHost) {
        BluetoothService.sendMessage({
          type: 'GAME_OVER',
          winner,
          scores: { player1: score.p1, player2: score.p2 },
        });
      }

      router.replace({
        pathname: '/gameover',
        params: { winner },
      });
      return;
    }

    const next = myPlayerNumber === 1 ? 2 : 1;
    BluetoothService.sendMessage({
      type: 'TURN_CHANGED',
      currentPlayer: next,
    });
    setCurrentTurn(next);

    setTimeout(() => {
      setCurrentCategory(null);
      setCurrentQuestion(null);
      setShowFeedback({ type: null, message: '' });
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <TurnIndicator visible={showTurnAnim} player={currentTurn} />

      <View style={styles.turnBar}>
        <Text style={styles.turnText}>
          Turno de: {currentTurn === 1 ? 'Player 1' : 'Player 2'}{' '}
          {currentTurn === myPlayerNumber ? '(Tú)' : ''}
        </Text>
      </View>

      <View style={styles.statsBar}>
        <View style={styles.playerBox}>
          <Text style={styles.playerLabel}>P1</Text>
          <Hearts lives={lives.p1} />
          <Text style={styles.scoreText}>🏆 {score.p1}</Text>
        </View>

        <View style={styles.playerBox}>
          <Text style={styles.playerLabel}>P2</Text>
          <Hearts lives={lives.p2} />
          <Text style={styles.scoreText}>🏆 {score.p2}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContent}>
        {showFeedback.type && (
          <View
            style={[
              styles.feedbackContainer,
              showFeedback.type === 'correct'
                ? styles.feedbackCorrect
                : styles.feedbackIncorrect,
            ]}
          >
            <Text style={styles.feedbackText}>
              {showFeedback.type === 'correct' ? '🎉' : '❌'} {showFeedback.message}
            </Text>
          </View>
        )}

        {!currentCategory && !showFeedback.type && (
          <CategoryWheel categories={categories} onSelect={handleSelectCategory} />
        )}

        {currentCategory && currentQuestion && !showFeedback.type && (
          <QuestionCard item={currentQuestion} onAnswer={handleAnswer} />
        )}
      </ScrollView>
    </View>
  );
}

/* ─────────────────────────────
   ESTILOS COMPARTIDOS
   ───────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF6' },
  turnBar: {
    paddingVertical: 8,
    backgroundColor: '#FFEB3B',
    alignItems: 'center',
  },
  turnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  playerBox: {
    alignItems: 'center',
  },
  playerLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  scrollContent: { flex: 1, padding: 10 },
  feedbackContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
  },
  feedbackCorrect: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  feedbackIncorrect: {
    borderColor: '#E53935',
    backgroundColor: '#FFEBEE',
  },
  feedbackText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  // Extras usados en single player
  categoryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#2196F3',
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1976D2',
  },
 center: {
  alignItems: 'center',
  width: '100%',
  marginTop: 20,
  marginBottom: 10,
},

 centerText: {
  color: '#666',
  fontSize: 16,
  textAlign: 'center',
  fontStyle: 'italic',
},

  progressContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});
