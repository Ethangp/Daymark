import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from './GlassCard';
import { ProgressRing } from './ProgressRing';
import { TimeDisplay } from './TimeDisplay';
import { GRADIENT_THEMES } from '../constants/themes';
import { getProgress, getTimeRemaining } from '../utils/dateUtils';
import type { CountdownEvent } from '../context/EventsContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 12;
const CARD_PADDING = 20;

interface CountdownCardProps {
  event: CountdownEvent;
  index: number;
  onPress: () => void;
  onLongPress: () => void;
}

export function CountdownCard({ event, index, onPress, onLongPress }: CountdownCardProps) {
  const theme = GRADIENT_THEMES[event.color];
  const progress = getProgress(event.startDate, event.targetDate);
  const time = getTimeRemaining(event.targetDate);
  const percentage = Math.round(progress * 100);

  if (event.size === 'large') {
    return (
      <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.8}>
          <GlassCard style={styles.largCard}>
            <LinearGradient
              colors={[`${theme.start}30`, `${theme.end}15`]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.largeHeader}>
              <Text style={styles.emoji}>{event.emoji}</Text>
              <View style={styles.titleArea}>
                <Text style={styles.largeTitle} numberOfLines={1}>
                  {event.title}
                </Text>
                {event.isPinned && <Text style={styles.pin}>📌</Text>}
              </View>
            </View>
            <View style={styles.largeBody}>
              <ProgressRing
                progress={progress}
                size={100}
                strokeWidth={8}
                gradientStart={theme.start}
                gradientEnd={theme.end}
              />
              <View style={styles.largeCenter}>
                <Text style={[styles.percentage, { color: theme.accent }]}>
                  {percentage}%
                </Text>
              </View>
            </View>
            <TimeDisplay
              targetDate={event.targetDate}
              isCountUp={event.isCountUp}
              accentColor={theme.accent}
            />
            {time.isPast && !event.isCountUp && (
              <Text style={styles.pastLabel}>Completed!</Text>
            )}
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (event.size === 'small') {
    const cardWidth = (SCREEN_WIDTH - CARD_PADDING * 2 - CARD_GAP) / 2;
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 80).springify()}
        style={{ width: cardWidth }}
      >
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.8}>
          <GlassCard style={styles.smallCard}>
            <LinearGradient
              colors={[`${theme.start}30`, `${theme.end}15`]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.smallHeader}>
              <Text style={styles.smallEmoji}>{event.emoji}</Text>
              {event.isPinned && <Text style={styles.smallPin}>📌</Text>}
            </View>
            <Text style={styles.smallTitle} numberOfLines={1}>
              {event.title}
            </Text>
            <View style={styles.smallRingRow}>
              <ProgressRing
                progress={progress}
                size={52}
                strokeWidth={5}
                gradientStart={theme.start}
                gradientEnd={theme.end}
              />
              <View style={styles.smallPercent}>
                <Text style={[styles.smallPercentText, { color: theme.accent }]}>
                  {percentage}%
                </Text>
              </View>
            </View>
            <TimeDisplay
              targetDate={event.targetDate}
              isCountUp={event.isCountUp}
              compact
              accentColor={theme.accent}
            />
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Medium (default)
  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.8}>
        <GlassCard style={styles.mediumCard}>
          <LinearGradient
            colors={[`${theme.start}30`, `${theme.end}15`]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.mediumRow}>
            <View style={styles.mediumLeft}>
              <View style={styles.mediumHeader}>
                <Text style={styles.mediumEmoji}>{event.emoji}</Text>
                <Text style={styles.mediumTitle} numberOfLines={1}>
                  {event.title}
                </Text>
                {event.isPinned && <Text style={styles.pin}>📌</Text>}
              </View>
              <TimeDisplay
                targetDate={event.targetDate}
                isCountUp={event.isCountUp}
                compact
                accentColor={theme.accent}
              />
              {time.isPast && !event.isCountUp && (
                <Text style={styles.pastLabel}>Completed!</Text>
              )}
            </View>
            <View style={styles.mediumRight}>
              <ProgressRing
                progress={progress}
                size={68}
                strokeWidth={6}
                gradientStart={theme.start}
                gradientEnd={theme.end}
              />
              <View style={styles.mediumPercent}>
                <Text style={[styles.mediumPercentText, { color: theme.accent }]}>
                  {percentage}%
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Large card
  largCard: {
    marginBottom: CARD_GAP,
  },
  largeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  emoji: {
    fontSize: 32,
  },
  titleArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  largeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  pin: {
    fontSize: 14,
  },
  largeBody: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  largeCenter: {
    position: 'absolute',
  },
  percentage: {
    fontSize: 22,
    fontWeight: '800',
  },
  pastLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
    marginTop: 4,
  },

  // Medium card
  mediumCard: {
    marginBottom: CARD_GAP,
  },
  mediumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mediumLeft: {
    flex: 1,
    gap: 8,
  },
  mediumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mediumEmoji: {
    fontSize: 24,
  },
  mediumTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  mediumRight: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    position: 'relative',
  },
  mediumPercent: {
    position: 'absolute',
  },
  mediumPercentText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Small card
  smallCard: {
    marginBottom: CARD_GAP,
  },
  smallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  smallEmoji: {
    fontSize: 22,
  },
  smallPin: {
    fontSize: 12,
  },
  smallTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  smallRingRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  smallPercent: {
    position: 'absolute',
  },
  smallPercentText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
