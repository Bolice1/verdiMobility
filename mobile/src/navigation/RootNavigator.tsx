import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../context/AuthProvider';
import { LoginScreen } from '../screens/LoginScreen';
import { MarketplaceScreen } from '../screens/MarketplaceScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ShipmentBookingScreen } from '../screens/ShipmentBookingScreen';
import { TrackingScreen } from '../screens/TrackingScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#071410' },
        headerTintColor: '#f0fdf4',
        tabBarStyle: { backgroundColor: '#071410' },
        tabBarActiveTintColor: '#86efac',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tabs.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tabs.Screen name="Book Shipment" component={ShipmentBookingScreen} />
      <Tabs.Screen name="Tracking" component={TrackingScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#86efac" />
        <Text style={styles.loadingText}>Loading workspace...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#071410' },
        headerTintColor: '#f0fdf4',
        contentStyle: { backgroundColor: '#071410' },
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="Workspace" component={MainTabs} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#071410',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#f0fdf4',
  },
});
