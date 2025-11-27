// components/QuestionCard.tsx
import { Question } from '@/src/data/questions';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  item: Question;
  onAnswer: (option: string) => void;
  category?: string;
  disabled?: boolean; // 🔥 Bloquear si NO es tu turno
}

// 👉 Normalizador para evitar problemas con acentos, mayúsculas y espacios
const normalize = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

// 👉 Colores por categoría normalizada
const categoryColors: Record<string, string> = {
  ingenieria: '#FF6B35',
  medicina: '#4ECDC4',
};

export default function QuestionCard({
  item,
  onAnswer,
  category = 'Ingenieria',
  disabled = false,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(20);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const headerColor =
    categoryColors[normalize(category)] || '#FF6B35';

  // 🔥 Temporizador de 20 segundos
  useEffect(() => {
    // Si no es tu turno, no corremos timer
    if (disabled) return;

    // Reiniciar contador cuando cambia de pregunta
    setTimeLeft(20);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          // Tiempo agotado -> mandamos código especial
          onAnswer('__TIMEOUT__');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [item.id, disabled, onAnswer]);

  const handleSelectOption = (option: string) => {
    if (disabled) return; // 🚫 Bloqueado por turno

    // Paramos el timer porque ya respondió
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const correct = option === item.answer;
    setSelectedOption(option);
    setIsCorrect(correct);

    setTimeout(() => {
      onAnswer(option);
      setSelectedOption(null);
      setIsCorrect(null);
    }, 500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>❔</Text>
        </View>
        <Text style={styles.headerTitle}>TRIVIAFESC</Text>
      </View>

      {/* Pregunta */}
      <View style={styles.card}>
        <Text style={styles.question}>{item.question}</Text>
      </View>

      {/* Temporizador */}
      {!disabled && (
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>⏳ {timeLeft}s</Text>
        </View>
      )}

      {/* Opciones */}
      <View style={styles.optionsContainer}>
        {item.options.map((option, index) => {
          const isSelected = selectedOption === option;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,

                // ⛔️ Si está deshabilitado, NO mostrar estilos de correcto/incorrecto
                !disabled &&
                  isSelected &&
                  (isCorrect
                    ? styles.optionButtonCorrect
                    : styles.optionButtonIncorrect),

                disabled && styles.disabledOption,
              ]}
              onPress={() => handleSelectOption(option)}
              activeOpacity={disabled ? 1 : 0.7}
              disabled={disabled}
            >
              <Text
                style={[
                  styles.optionText,

                  // ⛔️ No aplicar estilo de seleccionado cuando está disabled
                  !disabled && isSelected && styles.optionTextSelected,

                  disabled && { opacity: 0.5 },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },

  icon: { fontSize: 28 },

  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  card: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 25,
    borderRadius: 20,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },

  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 30,
  },

  timerBox: {
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
  },

  timerText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E53935',
  },

  optionsContainer: {
    marginTop: 20,
    gap: 12,
  },

  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  optionButtonCorrect: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
    transform: [{ scale: 0.98 }],
  },

  optionButtonIncorrect: {
    backgroundColor: '#E53935',
    borderColor: '#B71C1C',
    transform: [{ scale: 0.98 }],
  },

  disabledOption: {
    opacity: 0.35,
  },

  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
  },

  optionTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
});
