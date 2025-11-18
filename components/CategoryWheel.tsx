// components/CategoryWheel.tsx
import { useLanguage } from '@/contexts/LanguageContext';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

export type CategoryWheelRef = {
  spinRandom: () => void;
  spinToCategory: (category: string) => void;
};

interface Props {
  categories: string[];
  onSelect: (category: string) => void;
  disabled?: boolean;
}

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width - 40, 300);
const RADIUS = WHEEL_SIZE / 2;

function CategoryWheel(
  { categories, onSelect, disabled = false }: Props,
  ref: React.Ref<CategoryWheelRef>,
) {
  const { t } = useLanguage();

  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const spinValue = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0);

  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
    '#F8C471',
    '#82E0AA',
  ];

  const segmentAngle = 360 / categories.length;

  // ============================================
  // SPIN LOCAL (aleatorio)
  // ============================================
  const spinRandom = () => {
    if (disabled || spinning) return;

    setSpinning(true);
    setSelected(null);

    const spins = 5 + Math.random() * 5;
    const finalAngle = Math.random() * 360;

    const totalRotation =
      currentRotation.current + spins * 360 + finalAngle;

    const finalPos = totalRotation % 360;
    const adjusted = (finalPos + 90) % 360;
    const index = Math.floor(adjusted / segmentAngle) % categories.length;
    const chosen = categories[index];

    Animated.timing(spinValue, {
      toValue: totalRotation,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      currentRotation.current = totalRotation;
      setSelected(chosen);
      setSpinning(false);
      onSelect(chosen);
    });
  };

  // ============================================
  // SPIN REMOTO (hacia una categoría específica)
  // ============================================
  const spinToCategory = (category: string) => {
    if (spinning) return;

    const index = categories.indexOf(category);
    if (index === -1) return;

    setSpinning(true);
    setSelected(null);

    const spins = 5 + Math.random() * 5;
    const targetAngle = index * segmentAngle;
    const totalRotation =
      currentRotation.current + spins * 360 + targetAngle;

    Animated.timing(spinValue, {
      toValue: totalRotation,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      currentRotation.current = totalRotation;
      setSelected(category);
      setSpinning(false);
      onSelect(category);
    });
  };

  // Exponer funciones al padre
  useImperativeHandle(ref, () => ({
    spinRandom,
    spinToCategory,
  }));

  // ============================================
  // Dibujar segmentos
  // ============================================
  const createSegmentPath = (index: number) => {
    const start = index * segmentAngle - 90;
    const end = (index + 1) * segmentAngle - 90;

    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;

    const x1 = RADIUS + (RADIUS - 20) * Math.cos(startRad);
    const y1 = RADIUS + (RADIUS - 20) * Math.sin(startRad);
    const x2 = RADIUS + (RADIUS - 20) * Math.cos(endRad);
    const y2 = RADIUS + (RADIUS - 20) * Math.sin(endRad);

    const large = segmentAngle > 180 ? 1 : 0;

    return `M ${RADIUS} ${RADIUS} L ${x1} ${y1} A ${
      RADIUS - 20
    } ${RADIUS - 20} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  const getTextPos = (index: number) => {
    const angle =
      ((index * segmentAngle + segmentAngle / 2) - 90) * (Math.PI / 180);
    const r = RADIUS * 0.7;
    const x = RADIUS + r * Math.cos(angle);
    const y = RADIUS + r * Math.sin(angle);

    return {
      x,
      y,
      angle: (angle * 180) / Math.PI + 90,
    };
  };

  const translateCategory = (c: string) => {
    const key = `categories.${c}`;
    const translated = t(key);
    return translated !== key ? translated : c;
  };

  const spin360 = spinValue.interpolate({
    inputRange: [0, 36000],
    outputRange: ['0deg', '36000deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('wheel.title')}</Text>

      <View style={styles.wheelContainer}>
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>▼</Text>
        </View>

        <Animated.View
          style={[styles.wheel, { transform: [{ rotate: spin360 }] }]}
        >
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
            <Circle
              cx={RADIUS}
              cy={RADIUS}
              r={RADIUS - 10}
              fill="#333"
              stroke="#000"
              strokeWidth="4"
            />

            {categories.map((cat, i) => {
              const pos = getTextPos(i);
              const color = colors[i % colors.length];
              const text = translateCategory(cat);

              return (
                <G key={i}>
                  <Path
                    d={createSegmentPath(i)}
                    fill={color}
                    stroke="#fff"
                    strokeWidth="2"
                  />

                  <SvgText
                    x={pos.x}
                    y={pos.y}
                    fill="#000"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${
                      pos.angle > 90 && pos.angle < 270
                        ? pos.angle + 180
                        : pos.angle
                    }, ${pos.x}, ${pos.y})`}
                  >
                    {text.length > 8 ? text.slice(0, 8) + '...' : text}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (spinning || disabled) && styles.buttonDisabled,
        ]}
        onPress={spinRandom}
        disabled={spinning || disabled}
      >
        <Text style={styles.buttonText}>
          {spinning ? t('wheel.spinning') : t('wheel.spin')}
        </Text>
      </TouchableOpacity>

      {selected && !spinning && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>{t('wheel.result')}</Text>
          <Text style={styles.selected}>{translateCategory(selected)}</Text>
        </View>
      )}
    </View>
  );
}

export default forwardRef(CategoryWheel);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  wheelContainer: {
    position: 'relative',
    marginBottom: 30,
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
  arrow: {
    position: 'absolute',
    top: -15,
    left: WHEEL_SIZE / 2 - 10,
    zIndex: 5,
  },
  arrowText: {
    fontSize: 20,
    color: '#FF6B6B',
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  resultTitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#007AFF',
  },
  selected: {
    fontSize: 20,
    fontWeight: '700',
  },
});
