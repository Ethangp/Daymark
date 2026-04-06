import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { COLORS } from '../constants/themes';

const EMOJI_LIST = [
  '🎆', '🎂', '✈️', '🏖️', '📚', '🎄', '💪', '⭐',
  '🎃', '🎉', '💍', '🏠', '🎓', '🏆', '❤️', '🌟',
  '🚀', '🎵', '📅', '🌈', '🎯', '🧘', '🍕', '☕',
  '🌸', '🎮', '📸', '🎁', '🏃', '🌍', '🔔', '💎',
];

interface EmojiPickerProps {
  selected: string;
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ selected, onSelect }: EmojiPickerProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.grid}>
        {EMOJI_LIST.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[styles.item, selected === emoji && styles.selected]}
            onPress={() => onSelect(emoji)}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
  },
  item: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  selected: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  emoji: {
    fontSize: 22,
  },
});
