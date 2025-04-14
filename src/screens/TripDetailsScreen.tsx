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

const HEADER_MAX_HEIGHT = 350;
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

  const imageScale = scrollY.interpolate({
    inputRange: [-300, 0],
    outputRange: [1.5, 1],
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
            <Text style={styles.dayTitle}>{date}</Text>
          </View>
          
          {item.activities.length > 0 ? (
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
                <View style={styles.activityCountBadge}>
                  <Text style={styles.activityCount}>
                    {item.activities.length} {item.activities.length === 1 ? 'activity' : 'activities'}
                  </Text>
                </View>
                <Text style={styles.activityTitle} numberOfLines={1}>
                  {item.activities[0].title}
                </Text>
                <Text style={styles.activityLocation} numberOfLines={1}>
                  {item.activities[0].location}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.noActivitiesContainer}>
              <Text style={styles.noActivitiesText}>No activities planned for this day</Text>
            </View>
          )}
          <View style={styles.dayCardFooter}>
            <MaterialIcons name="arrow-forward" size={20} color="#FF385C" />
          </View>
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

  // Handle scroll event 
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Animated header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image 
          source={{ uri: trip.coverImageUrl }} 
          style={[
            styles.headerImage,
            { transform: [{ scale: imageScale }] }
          ]} 
        />
        <View style={styles.headerOverlay} />
        <Animated.View 
          style={[
            styles.headerBackground, 
            { opacity: headerTitleOpacity }
          ]}
        />
        <Animated.View style={[styles.headerTitleContainer, { opacity: headerTitleOpacity }]}>
          <Text style={styles.headerTitle}>{trip.destination}</Text>
        </Animated.View>
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
        <View style={styles.contentContainer}>
          <View style={styles.mainInfo}>
            <Text style={styles.title}>{trip.title}</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialIcons name="event" size={20} color="#666" />
                <Text style={styles.infoText}>
                  {formattedStartDate} – {formattedEndDate}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialIcons name="location-on" size={20} color="#666" />
                <Text style={styles.infoText}>{trip.destination}</Text>
              </View>
            </View>
            
            <View style={styles.agencyContainer}>
              <View style={styles.agencyIconContainer}>
                <MaterialIcons name="business" size={24} color="#fff" />
              </View>
              <View style={styles.agencyInfo}>
                <Text style={styles.agencyLabel}>Travel Agency</Text>
                <Text style={styles.agencyName}>{trip.travelAgency}</Text>
              </View>
            </View>
            
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>About this trip</Text>
              <Text style={styles.description}>{trip.description}</Text>
            </View>
          </View>
          
          <View style={styles.itineraryContainer}>
            <Text style={styles.sectionTitle}>Itinerary</Text>
            
            <View style={styles.daysContainer}>
              {trip.days.map((day, index) => (
                <View key={day.id}>
                  {renderDayItem({ item: day, index })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#222',
    zIndex: 1,
  },
  headerTitleContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 3,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    zIndex: 1,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 2,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  scrollContent: {
    paddingTop: HEADER_MAX_HEIGHT - 30,
  },
  contentContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#f5f5f5',
    paddingBottom: 40,
    marginTop: -30,
  },
  mainInfo: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  agencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  agencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  agencyInfo: {
    flex: 1,
  },
  agencyLabel: {
    fontSize: 12,
    color: '#666',
  },
  agencyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  descriptionContainer: {
    marginTop: 4,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#444',
  },
  itineraryContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  daysContainer: {},
  dayCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    overflow: 'hidden',
  },
  dayNumberBadge: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FF385C',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  dayContent: {
    flex: 1,
    padding: 16,
  },
  dayHeader: {
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  activitiesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  activityImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityCountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  activityCount: {
    fontSize: 12,
    color: '#666',
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 13,
    color: '#666',
  },
  dayCardFooter: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  noActivitiesContainer: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
  },
  noActivitiesText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default TripDetailsScreen; 