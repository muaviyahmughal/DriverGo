import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  // Create animated values
  const spinValue = new Animated.Value(0);
  const fadeValue = new Animated.Value(1);

  useEffect(() => {
    // Start spinning animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // After 2.5 seconds, start fade out animation
    const timer = setTimeout(() => {
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          onAnimationComplete();
        }
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Interpolate the spin value to rotate from 0 to 360 degrees
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeValue }]}>
      <Image
        source={require('../../assets/splash-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Animated.View
        style={[
          styles.loadingIndicator,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').width * 0.6,
    marginBottom: 40,
  },
  loadingIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#007AFF',
    borderTopColor: 'transparent',
  },
});
