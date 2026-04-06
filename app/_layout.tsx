import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { EventsProvider } from '../src/context/EventsContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

function SettingsButton() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push('/settings')} style={styles.headerBtn}>
      <Text style={styles.headerBtnText}>⚙️</Text>
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <EventsProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#0a0a1a' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: '#0a0a1a' },
            animation: 'slide_from_bottom',
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Daymark',
              headerLargeTitle: true,
              headerLargeTitleStyle: {
                fontWeight: '800',
                color: '#FFFFFF',
              },
              headerRight: () => <SettingsButton />,
            }}
          />
          <Stack.Screen
            name="add"
            options={{
              title: 'New Countdown',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Settings',
            }}
          />
        </Stack>
      </EventsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  headerBtn: {
    padding: 8,
  },
  headerBtnText: {
    fontSize: 22,
  },
});
