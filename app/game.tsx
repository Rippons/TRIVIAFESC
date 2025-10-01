// app/game.tsx
import CategoryWheel from '@/components/CategoryWheel';
import QuestionCard from '@/components/QuestionCard';
import { QUESTIONS, Question } from '@/src/data/questions';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Game() {
  const router = useRouter();

  // Al montar el componente, verifica las categorías cargadas
  const categories = useMemo(() => {
    const keys = Object.keys(QUESTIONS);
    console.log('📋 Categorías detectadas en Game:', keys);
    return keys;
  }, []);

  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [showFeedback, setShowFeedback] = useState<{
    type: 'correct' | 'incorrect' | null;
    message: string;
  }>({ type: null, message: '' });

  // Selección de pregunta de una categoría
  const selectQuestionFromCategory = useCallback(
    (category: string) => {
      console.log('🎡 Seleccionando pregunta para categoría:', category);

      const pool = QUESTIONS[category] ?? [];
      console.log(`📊 Preguntas totales en ${category}:`, pool.length);

      const available = pool.filter((q) => !usedIds.has(q.id));
      console.log('✅ Preguntas disponibles:', available.length);

      if (available.length === 0) {
        console.warn('⚠️ Sin más preguntas en esta categoría.');
        Alert.alert(
          'Sin más preguntas', 
          'Esa categoría no tiene más preguntas. Gira de nuevo.',
          [{ text: 'OK', onPress: () => {
            setCurrentCategory(null);
            setCurrentQuestion(null);
          }}]
        );
        return;
      }

      const q = available[Math.floor(Math.random() * available.length)];
      console.log('🎯 Pregunta seleccionada:', q);

      setCurrentQuestion(q);
      // NO agregamos al usedIds aquí, lo hacemos solo cuando responda correctamente
    },
    [usedIds]
  );

  // Si las vidas llegan a 0 → redirigir a Game Over
  useEffect(() => {
    console.log('❤️ Vidas actuales:', lives);
    if (lives <= 0) {
      console.warn('💀 Sin vidas, redirigiendo a Game Over con score:', score);
      router.replace({ pathname: '/gameover', params: { score } });
    }
  }, [lives, router, score]);

  // Cada vez que se elige una categoría, cargar pregunta
  useEffect(() => {
    console.log('📌 currentCategory cambió a:', currentCategory);
    if (currentCategory) {
      selectQuestionFromCategory(currentCategory);
    }
  }, [currentCategory, selectQuestionFromCategory]);

  // Cuando se selecciona una categoría desde la ruleta
  const handleSelectCategory = (cat: string) => {
    console.log('▶️ handleSelectCategory llamado con:', cat);
    setCurrentCategory(cat);
    setShowFeedback({ type: null, message: '' }); // Limpiar feedback anterior
  };

  // Cuando el usuario responde una pregunta
  const handleAnswer = (option: string) => {
    console.log('📝 Respuesta seleccionada:', option);
    if (!currentQuestion) {
      console.warn('⚠️ No hay pregunta actual para validar.');
      return;
    }

    const correct = option === currentQuestion.answer;
    console.log('✅ ¿Respuesta correcta?', correct);

    if (correct) {
      const newScore = score + 10;
      console.log('🏆 Nuevo puntaje:', newScore);
      setScore(newScore);
      
      // SOLO cuando es correcta, marcar como usada
      setUsedIds((prev) => {
        const updated = new Set(prev).add(currentQuestion.id);
        console.log('🆔 IDs de preguntas correctas:', Array.from(updated));
        return updated;
      });
      
      // Mostrar feedback positivo
      setShowFeedback({
        type: 'correct',
        message: '¡Correcto! +10 puntos'
      });

      const totalQuestions = Object.values(QUESTIONS).flat().length;
      console.log('🔢 Total de preguntas en el juego:', totalQuestions);
      console.log('🔢 Preguntas correctas hasta ahora:', usedIds.size + 1);

      if (usedIds.size + 1 >= totalQuestions) {
        console.log('🎉 Todas las preguntas respondidas, fin del juego.');
        setTimeout(() => {
          router.replace({ pathname: '/gameover', params: { score: newScore } });
        }, 2000);
        return;
      }

      // Delay para mostrar el feedback antes de volver a la ruleta
      setTimeout(() => {
        setCurrentCategory(null);
        setCurrentQuestion(null);
        setShowFeedback({ type: null, message: '' });
      }, 2000);

    } else {
      console.warn('❌ Respuesta incorrecta. Restando una vida.');
      
      // Mostrar feedback negativo con la respuesta correcta
      setShowFeedback({
        type: 'incorrect',
        message: `Incorrecto. La respuesta era: ${currentQuestion.answer}`
      });
      
      setLives((l) => l - 1);

      // Delay para mostrar el feedback antes de continuar
      setTimeout(() => {
        // Opción 1: Volver a la ruleta después de respuesta incorrecta
        setCurrentCategory(null);
        setCurrentQuestion(null);
        setShowFeedback({ type: null, message: '' });
        
        // Opción 2: Mantener la misma categoría y cargar nueva pregunta
        // selectQuestionFromCategory(currentCategory);
        // setShowFeedback({ type: null, message: '' });
      }, 3000);
    }
  };



  return (
    <View style={styles.container}>
      {/* Stats en la parte superior */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>❤️ Vidas: {lives}</Text>
        <Text style={styles.statsText}>🏆 Puntaje: {score}</Text>
      </View>

      {/* Contenido scrolleable */}
      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={true}
      >
        {/* Feedback de respuesta */}
        {showFeedback.type && (
          <View style={[
            styles.feedbackContainer,
            showFeedback.type === 'correct' ? styles.feedbackCorrect : styles.feedbackIncorrect
          ]}>
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
            <Text style={styles.categoryText}>Categoría: {currentCategory}</Text>
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
              {currentCategory ? 'Cargando pregunta...' : 'Gira la ruleta para elegir una categoría'}
            </Text>
          </View>
        ) : null}

        {/* Progreso del juego */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Preguntas respondidas: {usedIds.size} / {Object.values(QUESTIONS).flat().length}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#FFFDF6'
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
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
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    minHeight: 200,
  },
  centerText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  feedbackContainer: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 3,
  },
  feedbackCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  feedbackIncorrect: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
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