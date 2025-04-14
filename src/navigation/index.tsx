import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Trip } from '../types';
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

// Screens
import TripsScreen from '../screens/TripsScreen';
import TripDetailsScreen from '../screens/TripDetailsScreen';
import DayDetailsScreen from '../screens/DayDetailsScreen';
import ActivityDetailsScreen from '../screens/ActivityDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Define navigation param types
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  TripDetails: { tripId: string };
  DayDetails: { tripId: string, dayId: string };
  ActivityDetails: { tripId: string, dayId: string, activityId: string };
};

export type MainTabParamList = {
  Explore: undefined;
  Trips: undefined;
  Messages: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholder screen for Messages tab
const MessagesScreen = () => <View style={{ flex: 1, backgroundColor: '#f8f9fa' }} />;

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
          } else if (route.name === 'Messages') {
            iconName = 'chat-bubble-outline';
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
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const Navigation = () => {
  // For now, always start with the login screen
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'MainTabs' : 'Login'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="TripDetails" component={TripDetailsScreen} />
        <Stack.Screen name="DayDetails" component={DayDetailsScreen} />
        <Stack.Screen name="ActivityDetails" component={ActivityDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
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