import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENT_THEMES, THEME_KEYS, GradientTheme } from '../constants/themes';

interface ColorPickerProps {
  selected: GradientTheme;
  onSelect: (theme: GradientTheme) => void;
}

export function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  return (
    <View style={styles.row}>
      {THEME_KEYS.map((key) => {
        const theme = GRADIENT_THEMES[key];
        return (
          <TouchableOpacity
            key={key}
            style={[styles.item, selected === key && styles.selected]}
            onPress={() => onSelect(key)}
          >
            <LinearGradient
              colors={[theme.start, theme.end]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 8,
  },
  item: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  gradient: {
    flex: 1,
  },
});
