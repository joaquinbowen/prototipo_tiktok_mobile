import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = ['#FE2C55', '#25F4EE', '#FFD700', '#A855F7', '#10B981', '#F97316', '#3B82F6', '#EC4899'];
const COUNT = 24;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

type Particle = {
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  anim: Animated.Value;
  rotate: Animated.Value;
};

function makeParticles(): Particle[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    x: randomBetween(0, width - 12),
    color: COLORS[i % COLORS.length],
    size: randomBetween(6, 12),
    delay: randomBetween(0, 600),
    duration: randomBetween(1200, 2200),
    anim: new Animated.Value(0),
    rotate: new Animated.Value(0),
  }));
}

export function ConfettiEffect() {
  const particles = useRef<Particle[]>(makeParticles()).current;

  useEffect(() => {
    particles.forEach(p => {
      Animated.parallel([
        Animated.timing(p.anim, {
          toValue: 1,
          duration: p.duration,
          delay: p.delay,
          useNativeDriver: true,
        }),
        Animated.timing(p.rotate, {
          toValue: 1,
          duration: p.duration,
          delay: p.delay,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => {
        const translateY = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-30, height + 30],
        });
        const opacity = p.anim.interpolate({
          inputRange: [0, 0.1, 0.85, 1],
          outputRange: [0, 1, 1, 0],
        });
        const rotate = p.rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${randomBetween(180, 540)}deg`],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: p.x,
                width: p.size,
                height: p.size * (Math.random() > 0.5 ? 1 : 0.4),
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? p.size / 2 : 2,
                transform: [{ translateY }, { rotate }],
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    top: 0,
  },
});
