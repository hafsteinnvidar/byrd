import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Screens
import TripsScreen from '../screens/TripsScreen';
import TripDetailsScreen from '../screens/TripDetailsScreen';
import DayDetailsScreen from '../screens/DayDetailsScreen';
import ActivityDetailsScreen from '../screens/ActivityDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RestaurantsScreen from '../screens/RestaurantsScreen';
import RestaurantDetailsScreen from '../screens/RestaurantDetailsScreen';

// Define navigation param types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainTabs: undefined;
  TripDetails: { tripId: string };
  DayDetails: { tripId: string, dayId: string };
  ActivityDetails: { tripId: string, dayId: string, activityId: string };
  RestaurantDetails: { restaurant: any };
};

export type MainTabParamList = {
  Explore: undefined;
  Trips: undefined;
  Restaurants: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createNativeStackNavigator<RootStackParamList>();

// Authentication stack for non-authenticated users
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      {/* Additional auth screens would go here */}
    </AuthStack.Navigator>
  );
};

// Main app stack for authenticated users
const AppStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
      <Stack.Screen name="DayDetails" component={DayDetailsScreen} />
      <Stack.Screen name="ActivityDetails" component={ActivityDetailsScreen} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          if (route.name === 'Explore') {
            iconName = 'search';
          } else if (route.name === 'Trips') {
            iconName = 'apartment';
          } else if (route.name === 'Restaurants') {
            iconName = 'restaurant';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          } else {
            iconName = 'circle';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF385C',
        tabBarInactiveTintColor: '#717171',
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Trips" component={TripsScreen} />
      <Tab.Screen name="Restaurants" component={RestaurantsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const Navigation = () => {
  const { user, loading } = useAuth();
  
  // Show loading screen while checking authentication
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF385C" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: 80,
    paddingTop: 10,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
}); 