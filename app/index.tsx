import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEvents } from '../src/context/EventsContext';
import { CountdownCard } from '../src/components/CountdownCard';
import { COLORS } from '../src/constants/themes';

export default function HomeScreen() {
  const { events, isLoading, deleteEvent, togglePin } = useEvents();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    });
  }, [events]);

  const { largeCards, mediumCards, smallCards } = useMemo(() => {
    const large: typeof sortedEvents = [];
    const medium: typeof sortedEvents = [];
    const small: typeof sortedEvents = [];
    for (const e of sortedEvents) {
      if (e.size === 'large') large.push(e);
      else if (e.size === 'small') small.push(e);
      else medium.push(e);
    }
    return { largeCards: large, mediumCards: medium, smallCards: small };
  }, [sortedEvents]);

  const handleLongPress = (event: (typeof sortedEvents)[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(event.title, 'What would you like to do?', [
      { text: event.isPinned ? 'Unpin' : 'Pin', onPress: () => togglePin(event.id) },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          deleteEvent(event.id);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handlePress = (event: (typeof sortedEvents)[0]) => {
    router.push({ pathname: '/add', params: { editId: event.id } });
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {events.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>⏳</Text>
            <Text style={styles.emptyTitle}>No countdowns yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to create your first countdown
            </Text>
          </View>
        )}

        {/* Large cards - full width */}
        {largeCards.map((event, i) => (
          <CountdownCard
            key={event.id}
            event={event}
            index={i}
            onPress={() => handlePress(event)}
            onLongPress={() => handleLongPress(event)}
          />
        ))}

        {/* Medium cards - full width */}
        {mediumCards.map((event, i) => (
          <CountdownCard
            key={event.id}
            event={event}
            index={largeCards.length + i}
            onPress={() => handlePress(event)}
            onLongPress={() => handleLongPress(event)}
          />
        ))}

        {/* Small cards - 2-column grid */}
        {smallCards.length > 0 && (
          <View style={styles.smallGrid}>
            {smallCards.map((event, i) => (
              <CountdownCard
                key={event.id}
                event={event}
                index={largeCards.length + mediumCards.length + i}
                onPress={() => handlePress(event)}
                onLongPress={() => handleLongPress(event)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/add');
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#7B2FBE', '#BC6FF1']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.fabText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: 20,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  smallGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#7B2FBE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#FFFFFF',
    marginTop: -2,
  },
});
