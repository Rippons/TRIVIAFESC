// components/QuestionCard.tsx
import { Question } from '@/src/data/questions';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  item: Question;
  onAnswer: (option: string) => void;
  category?: string;
}

// Colores por categoría
const categoryColors: Record<string, string> = {
  Ingenieria: '#FF6B35', // Naranja
  Medicina: '#4ECDC4',   // Turquesa
};

export default function QuestionCard({ item, onAnswer, category = 'Ingenieria' }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const headerColor = categoryColors[category] || '#FF6B35';

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    // Pequeño delay para mostrar la selección antes de enviar la respuesta
    setTimeout(() => {
      onAnswer(option);
      setSelectedOption(null);
    }, 300);
  };

  return (
    <View style={styles.container}>
      {/* Header con ícono y título */}
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>❔</Text>
        </View>
        <Text style={styles.headerTitle}>TRIVIAFESC</Text>
      </View>

      {/* Tarjeta de pregunta */}
      <View style={styles.card}>
        <Text style={styles.question}>{item.question}</Text>
      </View>

      {/* Opciones de respuesta */}
      <View style={styles.optionsContainer}>
        {item.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && styles.optionButtonSelected
            ]}
            onPress={() => handleSelectOption(option)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.optionText,
              selectedOption === option && styles.optionTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 15,
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
  icon: {
    fontSize: 28,
  },
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
  optionButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
    transform: [{ scale: 0.98 }],
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