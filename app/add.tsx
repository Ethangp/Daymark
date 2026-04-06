import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEvents, CountdownEvent } from '../src/context/EventsContext';
import { EmojiPicker } from '../src/components/EmojiPicker';
import { ColorPicker } from '../src/components/ColorPicker';
import { COLORS, GradientTheme, GRADIENT_THEMES } from '../src/constants/themes';
import { LinearGradient } from 'expo-linear-gradient';

type Category = CountdownEvent['category'];
type CardSize = CountdownEvent['size'];

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'vacation', label: '✈️ Vacation' },
  { key: 'birthday', label: '🎂 Birthday' },
  { key: 'exam', label: '📚 Exam' },
  { key: 'holiday', label: '🎄 Holiday' },
  { key: 'fitness', label: '💪 Fitness' },
  { key: 'custom', label: '⭐ Custom' },
];

const SIZES: { key: CardSize; label: string }[] = [
  { key: 'small', label: 'Small' },
  { key: 'medium', label: 'Medium' },
  { key: 'large', label: 'Large' },
];

export default function AddScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ editId?: string }>();
  const { events, addEvent, updateEvent } = useEvents();

  const existingEvent = useMemo(
    () => (params.editId ? events.find((e) => e.id === params.editId) : undefined),
    [params.editId, events]
  );

  const [title, setTitle] = useState(existingEvent?.title ?? '');
  const [emoji, setEmoji] = useState(existingEvent?.emoji ?? '⭐');
  const [targetDate, setTargetDate] = useState(
    existingEvent ? new Date(existingEvent.targetDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [color, setColor] = useState<GradientTheme>(existingEvent?.color ?? 'ocean');
  const [category, setCategory] = useState<Category>(existingEvent?.category ?? 'custom');
  const [size, setSize] = useState<CardSize>(existingEvent?.size ?? 'medium');
  const [isCountUp, setIsCountUp] = useState(existingEvent?.isCountUp ?? false);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a name for your countdown.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const event: CountdownEvent = {
      id: existingEvent?.id ?? `event-${Date.now()}`,
      title: title.trim(),
      emoji,
      targetDate: targetDate.toISOString(),
      createdDate: existingEvent?.createdDate ?? new Date().toISOString(),
      startDate: existingEvent?.startDate ?? new Date().toISOString(),
      color,
      category,
      isCountUp,
      isPinned: existingEvent?.isPinned ?? false,
      size,
    };

    if (existingEvent) {
      updateEvent(event);
    } else {
      addEvent(event);
    }

    router.back();
  };

  const theme = GRADIENT_THEMES[color];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Text style={styles.sectionLabel}>Name</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="My countdown..."
          placeholderTextColor={COLORS.textTertiary}
          autoFocus={!existingEvent}
        />

        {/* Emoji */}
        <Text style={styles.sectionLabel}>Icon</Text>
        <EmojiPicker selected={emoji} onSelect={setEmoji} />

        {/* Date */}
        <Text style={styles.sectionLabel}>Target Date</Text>
        <View style={styles.dateRow}>
          <DateTimePicker
            value={targetDate}
            mode="date"
            display="default"
            onChange={(_, date) => date && setTargetDate(date)}
            themeVariant="dark"
            style={styles.datePicker}
          />
        </View>

        {/* Color Theme */}
        <Text style={styles.sectionLabel}>Color Theme</Text>
        <ColorPicker selected={color} onSelect={setColor} />

        {/* Category */}
        <Text style={styles.sectionLabel}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.key}
              style={[styles.chip, category === c.key && { backgroundColor: `${theme.start}40` }]}
              onPress={() => setCategory(c.key)}
            >
              <Text
                style={[
                  styles.chipText,
                  category === c.key && { color: theme.accent },
                ]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Size */}
        <Text style={styles.sectionLabel}>Widget Size</Text>
        <View style={styles.chipRow}>
          {SIZES.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[styles.chip, size === s.key && { backgroundColor: `${theme.start}40` }]}
              onPress={() => setSize(s.key)}
            >
              <Text
                style={[styles.chipText, size === s.key && { color: theme.accent }]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Count direction */}
        <Text style={styles.sectionLabel}>Direction</Text>
        <View style={styles.chipRow}>
          <TouchableOpacity
            style={[styles.chip, !isCountUp && { backgroundColor: `${theme.start}40` }]}
            onPress={() => setIsCountUp(false)}
          >
            <Text style={[styles.chipText, !isCountUp && { color: theme.accent }]}>
              ⏬ Count Down
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, isCountUp && { backgroundColor: `${theme.start}40` }]}
            onPress={() => setIsCountUp(true)}
          >
            <Text style={[styles.chipText, isCountUp && { color: theme.accent }]}>
              ⏫ Count Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity onPress={handleSave} activeOpacity={0.8} style={styles.saveBtn}>
          <LinearGradient
            colors={[theme.start, theme.end]}
            style={styles.saveGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.saveText}>
              {existingEvent ? 'Save Changes' : 'Create Countdown'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    fontSize: 17,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePicker: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
