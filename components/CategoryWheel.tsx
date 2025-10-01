import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions 
} from 'react-native';
import Svg, { Circle, Path, Text as SvgText, G } from 'react-native-svg';

interface Props {
  categories: string[];
  onSelect: (category: string) => void;
}

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width - 40, 300);
const RADIUS = WHEEL_SIZE / 2;

export default function CategoryWheel({ categories, onSelect }: Props) {
  console.log('📋 Categorías recibidas en Wheel:', categories);

  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0); // Mantener seguimiento de la rotación actual

  // Colores para los segmentos de la ruleta
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
  ];

  // Calcular el ángulo de cada segmento
  const segmentAngle = 360 / categories.length;

  const spin = () => {
    console.log('▶️ Inicio de giro...');
    setSpinning(true);
    setSelected(null);

    // Generar rotaciones aleatorias (múltiples vueltas + ángulo final)
    const spins = 5 + Math.random() * 5; // Entre 5 y 10 vueltas
    const finalAngle = Math.random() * 360;
    const totalRotation = currentRotation.current + (spins * 360) + finalAngle;

    // Calcular qué categoría quedará seleccionada
    // La flecha apunta hacia arriba, calculamos desde -90 grados (arriba)
    const finalPosition = totalRotation % 360;
    // Ajustar el cálculo para que coincida con la nueva disposición de segmentos
    const adjustedAngle = (finalPosition + 90) % 360;
    const selectedIndex = Math.floor(adjustedAngle / segmentAngle) % categories.length;
    const chosen = categories[selectedIndex];

    console.log('🔄 Rotación actual:', currentRotation.current);
    console.log('🎯 Rotación final:', totalRotation);
    console.log('📐 Posición final:', finalPosition);
    console.log('🔧 Ángulo ajustado:', adjustedAngle);
    console.log('🔢 Índice seleccionado:', selectedIndex);
    console.log('✅ Categoría elegida:', chosen);

    Animated.timing(spinValue, {
      toValue: totalRotation,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      // Actualizar la rotación actual para el próximo giro
      currentRotation.current = totalRotation;
      
      setSelected(chosen);
      setSpinning(false);
      console.log('📨 Llamando a onSelect con:', chosen);
      onSelect(chosen);
    });
  };

  // Crear los paths SVG para cada segmento
  const createSegmentPath = (index: number) => {
    // Ajustar para que el primer segmento empiece en la parte superior (-90 grados)
    const startAngle = (index * segmentAngle) - 90;
    const endAngle = ((index + 1) * segmentAngle) - 90;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = RADIUS + (RADIUS - 20) * Math.cos(startAngleRad);
    const y1 = RADIUS + (RADIUS - 20) * Math.sin(startAngleRad);
    const x2 = RADIUS + (RADIUS - 20) * Math.cos(endAngleRad);
    const y2 = RADIUS + (RADIUS - 20) * Math.sin(endAngleRad);
    
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    return `M ${RADIUS} ${RADIUS} L ${x1} ${y1} A ${RADIUS - 20} ${RADIUS - 20} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Calcular posición del texto en cada segmento
  const getTextPosition = (index: number) => {
    // Ajustar para que coincida con la nueva posición de los segmentos
    const angle = ((index * segmentAngle + segmentAngle / 2) - 90) * (Math.PI / 180);
    const textRadius = RADIUS * 0.7;
    const x = RADIUS + textRadius * Math.cos(angle);
    const y = RADIUS + textRadius * Math.sin(angle);
    return { x, y, angle: ((angle * (180 / Math.PI)) + 90) };
  };

  const spin360 = spinValue.interpolate({
    inputRange: [0, 36000], // Rango más amplio para múltiples rotaciones
    outputRange: ['0deg', '36000deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎡 Gira la ruleta para elegir categoría</Text>

      <View style={styles.wheelContainer}>
        {/* Flecha indicadora */}
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>▼</Text>
        </View>

        {/* Ruleta */}
        <Animated.View 
          style={[
            styles.wheel,
            { transform: [{ rotate: spin360 }] }
          ]}
        >
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
            {/* Círculo de fondo */}
            <Circle
              cx={RADIUS}
              cy={RADIUS}
              r={RADIUS - 10}
              fill="#333"
              stroke="#000"
              strokeWidth="4"
            />
            
            {/* Segmentos de la ruleta */}
            {categories.map((category, index) => {
              const textPos = getTextPosition(index);
              const color = colors[index % colors.length];
              
              return (
                <G key={index}>
                  <Path
                    d={createSegmentPath(index)}
                    fill={color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <SvgText
                    x={textPos.x}
                    y={textPos.y}
                    fill="#000"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${textPos.angle > 90 && textPos.angle < 270 ? textPos.angle + 180 : textPos.angle}, ${textPos.x}, ${textPos.y})`}
                  >
                    {category.length > 8 ? category.substring(0, 8) + '...' : category}
                  </SvgText>
                </G>
              );
            })}
            
            {/* Centro de la ruleta */}
            <Circle
              cx={RADIUS}
              cy={RADIUS}
              r={20}
              fill="#333"
              stroke="#fff"
              strokeWidth="3"
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Botón de giro */}
      <TouchableOpacity 
        style={[styles.button, spinning && styles.buttonDisabled]} 
        onPress={spin}
        disabled={spinning}
      >
        <Text style={styles.buttonText}>
          {spinning ? '🌀 Girando...' : '🎡 Girar Ruleta'}
        </Text>
      </TouchableOpacity>

      {/* Resultado */}
      {selected && !spinning && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>🎉 ¡Resultado!</Text>
          <Text style={styles.selected}>{selected}</Text>
        </View>
      )}

      {/* Lista de categorías disponibles */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Categorías disponibles:</Text>
        <View style={styles.categoriesList}>
          {categories.map((category, index) => (
            <View 
              key={category} 
              style={[
                styles.categoryChip,
                { backgroundColor: colors[index % colors.length] }
              ]}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start', // Asegura que el contenido arranque desde arriba
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',     // Centrar texto
    alignSelf: 'center',     // Centrar dentro del contenedor
    color: '#333',
  },
  wheelContainer: {
    position: 'relative',
    marginBottom: 30,
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignSelf: 'center',
  },
  arrow: {
  position: 'absolute',
  top: -15,
  left: WHEEL_SIZE / 2 - 10,
  zIndex: 1,          // Menor para que no tape el botón
  pointerEvents: 'none', // Evita bloquear toques
},
  arrowText: {
    fontSize: 20,
    color: '#FF6B6B',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
  backgroundColor: '#007AFF',
  paddingVertical: 15,
  paddingHorizontal: 30,
  borderRadius: 25,
  marginBottom: 20,
  shadowColor: '#007AFF',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
  zIndex: 5,          // Asegura que esté encima
},

  buttonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  resultTitle: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 5,
  },
  selected: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  categoriesContainer: {
  marginTop: 30,        
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 10,
},

categoriesTitle: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 12,     
  color: '#555',
  textAlign: 'center',
  width: '100%',
},

categoriesList: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginBottom: 20,     
},
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 3,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
});
