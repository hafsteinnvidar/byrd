import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, StatusBar, Animated, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { mockTrips } from '../mockData/tripData';
import { Trip, DayItinerary } from '../types';
import { MaterialIcons } from '@expo/vector-icons';

type TripDetailsRouteProp = RouteProp<RootStackParamList, 'TripDetails'>;
type TripDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TripDetails'>;

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const TripDetailsScreen = () => {
  const route = useRoute<TripDetailsRouteProp>();
  const navigation = useNavigation<TripDetailsNavigationProp>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    // In a real app, we would fetch this from Supabase
    const foundTrip = mockTrips.find(t => t.id === route.params.tripId);
    if (foundTrip) {
      setTrip(foundTrip);
    }
  }, [route.params.tripId]);

  // Header animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-300, 0],
    outputRange: [2, 1],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp',
  });

  const renderDayItem = ({ item, index }: { item: DayItinerary; index: number }) => {
    const date = new Date(item.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    
    return (
      <TouchableOpacity 
        style={styles.dayCard}
        onPress={() => navigation.navigate('DayDetails', { 
          tripId: trip!.id, 
          dayId: item.id 
        })}
      >
        <View style={styles.dayNumberBadge}>
          <Text style={styles.dayNumber}>{index + 1}</Text>
        </View>
        
        <View style={styles.dayContent}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>Day {index + 1}</Text>
            <Text style={styles.dayDate}>{date}</Text>
          </View>
          
          {item.activities.length > 0 && (
            <View style={styles.activitiesPreview}>
              {item.activities[0].imageUrl ? (
                <Image 
                  source={{ uri: item.activities[0].imageUrl }} 
                  style={styles.activityImage} 
                />
              ) : (
                <View style={styles.activityImagePlaceholder}>
                  <MaterialIcons name="location-on" size={24} color="#ddd" />
                </View>
              )}
              
              <View style={styles.activityInfo}>
                <Text style={styles.activityCount}>
                  {item.activities.length} {item.activities.length === 1 ? 'activity' : 'activities'}
                </Text>
                <Text style={styles.activityTitle} numberOfLines={1}>
                  {item.activities[0].title}
                </Text>
                <Text style={styles.activityLocation} numberOfLines={1}>
                  {item.activities[0].location}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#ddd" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading trip details...</Text>
      </View>
    );
  }

  const formattedStartDate = new Date(trip.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  const formattedEndDate = new Date(trip.endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  // Handle scroll event without using Animated.event
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Animated header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View 
          style={[
            styles.headerBackground, 
            { opacity: headerBackgroundOpacity }
          ]}
        />
        <Animated.View style={[styles.headerTitleContainer, { opacity: headerTitleOpacity }]}>
          <Text style={styles.headerTitle}>{trip.destination}</Text>
          <Text style={styles.headerSubtitle}>
            {formattedStartDate} – {formattedEndDate}
          </Text>
        </Animated.View>
        <Animated.Image 
          source={{ uri: trip.coverImageUrl }} 
          style={[
            styles.headerImage,
            { transform: [{ scale: imageScale }] }
          ]} 
        />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        <View style={styles.mainInfo}>
          <Text style={styles.title}>{trip.title}</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color="#717171" />
            <Text style={styles.location}>{trip.destination}</Text>
          </View>
          
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <MaterialIcons name="event" size={20} color="#222" />
                <Text style={styles.detailText}>
                  {formattedStartDate} – {formattedEndDate}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="alarm" size={20} color="#222" />
                <Text style={styles.detailText}>
                  {trip.days.length} {trip.days.length === 1 ? 'day' : 'days'}
                </Text>
              </View>
            </View>
            
            <View style={styles.hostInfo}>
              <View style={styles.hostIcon}>
                <MaterialIcons name="business" size={20} color="#fff" />
              </View>
              <View style={styles.hostDetails}>
                <Text style={styles.hostedByLabel}>Hosted by</Text>
                <Text style={styles.hostedByName}>{trip.travelAgency}</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.description}>{trip.description}</Text>
        </View>
        
        <View style={styles.itinerarySection}>
          <Text style={styles.sectionTitle}>Trip Itinerary</Text>
          
          {trip.days.map((day, index) => (
            <View key={day.id}>
              {renderDayItem({ item: day, index })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  headerTitleContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  headerTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#717171',
    fontSize: 14,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  scrollContent: {
    paddingTop: HEADER_MAX_HEIGHT,
    paddingBottom: 24,
  },
  mainInfo: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 16,
    color: '#717171',
    marginLeft: 4,
  },
  detailsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#222',
    marginLeft: 8,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  hostIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hostDetails: {
    flex: 1,
  },
  hostedByLabel: {
    fontSize: 12,
    color: '#717171',
  },
  hostedByName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  itinerarySection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  dayCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  dayNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  dayContent: {
    flex: 1,
    padding: 12,
  },
  dayHeader: {
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  dayDate: {
    fontSize: 14,
    color: '#717171',
  },
  activitiesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  activityImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityCount: {
    fontSize: 12,
    color: '#717171',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  activityLocation: {
    fontSize: 12,
    color: '#717171',
  }
});

export default TripDetailsScreen; 