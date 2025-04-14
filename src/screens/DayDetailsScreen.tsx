import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Text, Animated, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation';
import { mockTrips } from '../mockData/tripData';
import { Trip, DayItinerary } from '../types';

type DayDetailsRouteProp = RouteProp<RootStackParamList, 'DayDetails'>;

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 250;

const DayDetailsScreen = () => {
  const route = useRoute<DayDetailsRouteProp>();
  const navigation = useNavigation();
  const [day, setDay] = useState<DayItinerary | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const scrollY = new Animated.Value(0);
  
  useEffect(() => {
    const { tripId, dayId } = route.params;
    const foundTrip = mockTrips.find(t => t.id === tripId);
    
    if (foundTrip) {
      setTrip(foundTrip);
      const foundDay = foundTrip.days.find(d => d.id === dayId);
      if (foundDay) {
        setDay(foundDay);
      }
    }
  }, [route.params]);

  if (!day || !trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading day details...</Text>
      </View>
    );
  }

  const dayIndex = trip.days.findIndex(d => d.id === day.id);
  const isFirstDay = dayIndex === 0;
  const isLastDay = dayIndex === trip.days.length - 1;
  
  // Handle scroll event without using Animated.event
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  // Header animations
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, HEADER_HEIGHT / 2],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
    outputRange: [1, 0.9, 0.8],
    extrapolate: 'clamp',
  });

  const formattedDate = new Date(day.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header Image */}
      <Animated.View 
        style={[
          styles.imageContainer,
          { transform: [{ translateY: imageTranslateY }] }
        ]}
      >
        <Image 
          source={{ uri: day.imageUrl || trip.coverImage }} 
          style={styles.image} 
        />
        <View style={styles.imageDarkOverlay} />
        <TouchableOpacity 
          style={styles.backButtonAlt}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Day {dayIndex + 1}</Text>
        </View>
      </Animated.View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {/* Spacer for header */}
        <View style={{ height: HEADER_HEIGHT }} />
        
        {/* Content */}
        <View style={styles.content}>
          <Animated.View style={[styles.titleContainer, { transform: [{ scale: titleScale }] }]}>
            <Text style={styles.dayNumber}>Day {dayIndex + 1}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </Animated.View>
          
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={[styles.navButton, isFirstDay && styles.navButtonDisabled]}
              disabled={isFirstDay}
              onPress={() => {
                if (!isFirstDay) {
                  navigation.navigate('DayDetails', {
                    tripId: trip.id,
                    dayId: trip.days[dayIndex - 1].id
                  });
                }
              }}
            >
              <MaterialIcons 
                name="keyboard-arrow-left" 
                size={24} 
                color={isFirstDay ? "#ccc" : "#666"} 
              />
              <Text style={[styles.navButtonText, isFirstDay && styles.navButtonTextDisabled]}>
                Previous Day
              </Text>
            </TouchableOpacity>
            
            <View style={styles.dayCounter}>
              <Text style={styles.dayCounterText}>
                {dayIndex + 1} of {trip.days.length}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.navButton, isLastDay && styles.navButtonDisabled]}
              disabled={isLastDay}
              onPress={() => {
                if (!isLastDay) {
                  navigation.navigate('DayDetails', {
                    tripId: trip.id,
                    dayId: trip.days[dayIndex + 1].id
                  });
                }
              }}
            >
              <Text style={[styles.navButtonText, isLastDay && styles.navButtonTextDisabled]}>
                Next Day
              </Text>
              <MaterialIcons 
                name="keyboard-arrow-right" 
                size={24} 
                color={isLastDay ? "#ccc" : "#666"} 
              />
            </TouchableOpacity>
          </View>
          
          {day.activities.length > 0 ? (
            <View style={styles.activitiesContainer}>
              <Text style={styles.sectionTitle}>Activities</Text>
              
              {day.activities.map((activity, index) => (
                <TouchableOpacity 
                  key={activity.id} 
                  style={styles.activityCard}
                  onPress={() => navigation.navigate('ActivityDetails', {
                    tripId: trip.id,
                    dayId: day.id,
                    activityId: activity.id
                  })}
                >
                  <View style={styles.activityTime}>
                    <Text style={styles.activityTimeText}>{activity.startTime}</Text>
                    <View style={styles.timelineContainer}>
                      <View style={styles.timelineDot} />
                      {index < day.activities.length - 1 && <View style={styles.timelineLine} />}
                    </View>
                  </View>
                  
                  <View style={styles.activityContent}>
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <Text style={styles.activityDuration}>
                        {activity.startTime} - {activity.endTime}
                      </Text>
                    </View>
                    <View style={styles.activityLocation}>
                      <MaterialIcons name="location-on" size={16} color="#666" />
                      <Text style={styles.activityLocationText}>{activity.location}</Text>
                    </View>
                    {activity.imageUrl && (
                      <Image source={{ uri: activity.imageUrl }} style={styles.activityImage} />
                    )}
                    <Text style={styles.activityDescription} numberOfLines={2}>
                      {activity.description}
                    </Text>
                    <View style={styles.activityCardFooter}>
                      <MaterialIcons name="arrow-forward" size={20} color="#666" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="event-busy" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No activities scheduled for this day</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    height: 90,
    padding: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageDarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButtonAlt: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
    paddingTop: 20,
    zIndex: 5,
  },
  titleContainer: {
    marginBottom: 20,
  },
  dayNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  date: {
    fontSize: 18,
    color: '#666',
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  dayCounter: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  dayCounterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  activitiesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  activityCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  activityTime: {
    width: 80,
    alignItems: 'center',
  },
  activityTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1a73e8',
    marginRight: 8,
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e0e0e0',
  },
  activityContent: {
    flex: 1,
    paddingLeft: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  activityDuration: {
    fontSize: 14,
    color: '#666',
  },
  activityLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityLocationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  activityImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  activityCardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default DayDetailsScreen; 