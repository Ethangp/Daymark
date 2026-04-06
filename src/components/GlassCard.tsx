import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GlassCard({ children, style }: GlassCardProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={25}
        tint="dark"
        style={[styles.card, style]}
      >
        <View style={styles.inner}>{children}</View>
      </BlurView>
    );
  }

  // Fallback for Android / web
  return (
    <View style={[styles.card, styles.fallback, style]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  fallback: {
    backgroundColor: 'rgba(30, 30, 50, 0.85)',
  },
  inner: {
    padding: 16,
  },
});
