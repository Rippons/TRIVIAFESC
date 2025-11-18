import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface Props {
  lives: number;
}

export default function Hearts({ lives }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3].map((i) => (
        <Heart key={i} active={i <= lives} />
      ))}
    </View>
  );
}

function Heart({ active }: { active: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    if (active) {
      // pulso infinito
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // animación de pérdida
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [active]);

  return (
    <Animated.Text
      style={[
        styles.heart,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      ❤️
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
  },
  heart: {
    fontSize: 32,
  },
});
