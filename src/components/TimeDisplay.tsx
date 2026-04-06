import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getTimeRemaining, TimeRemaining } from '../utils/dateUtils';

interface TimeDisplayProps {
  targetDate: string;
  isCountUp: boolean;
  compact?: boolean;
  accentColor?: string;
}

export function TimeDisplay({ targetDate, isCountUp, compact, accentColor }: TimeDisplayProps) {
  const [time, setTime] = useState<TimeRemaining>(getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const showTime = isCountUp && time.isPast ? { ...time, isPast: false } : time;

  if (compact) {
    return (
      <View style={styles.compactRow}>
        <Text style={[styles.compactNumber, accentColor ? { color: accentColor } : undefined]}>
          {showTime.days}
        </Text>
        <Text style={styles.compactLabel}>d </Text>
        <Text style={[styles.compactNumber, accentColor ? { color: accentColor } : undefined]}>
          {showTime.hours}
        </Text>
        <Text style={styles.compactLabel}>h </Text>
        <Text style={[styles.compactNumber, accentColor ? { color: accentColor } : undefined]}>
          {showTime.minutes}
        </Text>
        <Text style={styles.compactLabel}>m</Text>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <TimeUnit value={showTime.days} label="days" accentColor={accentColor} />
      <Text style={styles.separator}>:</Text>
      <TimeUnit value={showTime.hours} label="hrs" accentColor={accentColor} />
      <Text style={styles.separator}>:</Text>
      <TimeUnit value={showTime.minutes} label="min" accentColor={accentColor} />
      <Text style={styles.separator}>:</Text>
      <TimeUnit value={showTime.seconds} label="sec" accentColor={accentColor} />
    </View>
  );
}

function TimeUnit({
  value,
  label,
  accentColor,
}: {
  value: number;
  label: string;
  accentColor?: string;
}) {
  return (
    <View style={styles.unit}>
      <Text style={[styles.number, accentColor ? { color: accentColor } : undefined]}>
        {String(value).padStart(2, '0')}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unit: {
    alignItems: 'center',
  },
  number: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  separator: {
    fontSize: 18,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 12,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  compactNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  compactLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
