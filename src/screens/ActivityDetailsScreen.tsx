import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Animated, Dimensions, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation';
import { mockTrips } from '../mockData/tripData';
import { Activity, Trip, DayItinerary } from '../types';
import { useTheme } from 'react-native-paper';

type ActivityDetailsRouteProp = RouteProp<RootStackParamList, 'ActivityDetails'>;

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 300;

const ActivityDetailsScreen = () => {
  const route = useRoute<ActivityDetailsRouteProp>();
  const navigation = useNavigation();
  const theme = useTheme();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [day, setDay] = useState<DayItinerary | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const scrollY = new Animated.Value(0);
  
  useEffect(() => {
    const { tripId, dayId, activityId } = route.params;
    const foundTrip = mockTrips.find(t => t.id === tripId);
    
    if (foundTrip) {
      setTrip(foundTrip);
      const foundDay = foundTrip.days.find(d => d.id === dayId);
      if (foundDay) {
        setDay(foundDay);
        const foundActivity = foundDay.activities.find(a => a.id === activityId);
        if (foundActivity) {
          setActivity(foundActivity);
        }
      }
    }
  }, [route.params]);

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

  if (!activity || !day || !trip) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading activity details...</Text>
      </View>
    );
  }

  const activityIndex = day.activities.findIndex(a => a.id === activity.id);
  const isFirstActivity = activityIndex === 0;
  const isLastActivity = activityIndex === day.activities.length - 1;
  const dayNumber = trip.days.findIndex(d => d.id === day.id) + 1;

  // Handle scroll event without using Animated.event
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle={activity.imageUrl ? "light-content" : "dark-content"} />
      
      {/* Header Image */}
      {activity.imageUrl ? (
        <Animated.View 
          style={[
            styles.imageContainer, 
            { transform: [{ translateY: imageTranslateY }] }
          ]}
        >
          <Image source={{ uri: activity.imageUrl }} style={styles.image} />
          <View style={styles.imageDarkOverlay} />
          <TouchableOpacity 
            style={styles.backButtonAlt}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <View style={styles.noImageHeader}>
          <TouchableOpacity 
            style={styles.backButtonNoImage}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{activity.title}</Text>
        </View>
      </Animated.View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {/* Spacer for header */}
        <View style={{ height: activity.imageUrl ? HEADER_HEIGHT : 90 }} />
        
        {/* Content */}
        <View style={[styles.content, !activity.imageUrl && styles.contentWithoutImage]}>
          <Animated.View style={[styles.titleContainer, { transform: [{ scale: titleScale }] }]}>
            <Text style={styles.title}>{activity.title}</Text>
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={16} color="#666" />
              <Text style={styles.location}>{activity.location}</Text>
            </View>
          </Animated.View>
          
          <View style={styles.timeCard}>
            <View style={styles.dayInfo}>
              <Text style={styles.dayLabel}>Day {dayNumber}</Text>
              <Text style={styles.dayDate}>
                {new Date(day.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            
            <View style={styles.timeInfo}>
              <MaterialIcons name="access-time" size={18} color="#666" style={styles.timeIcon} />
              <Text style={styles.time}>{activity.startTime} - {activity.endTime}</Text>
            </View>
            
            <View style={styles.navigationButtons}>
              <TouchableOpacity 
                style={[styles.navButton, isFirstActivity && styles.navButtonDisabled]}
                disabled={isFirstActivity}
                onPress={() => {
                  if (!isFirstActivity) {
                    navigation.navigate('ActivityDetails', {
                      tripId: trip.id,
                      dayId: day.id,
                      activityId: day.activities[activityIndex - 1].id
                    });
                  }
                }}
              >
                <MaterialIcons 
                  name="keyboard-arrow-left" 
                  size={24} 
                  color={isFirstActivity ? "#ccc" : "#666"} 
                />
              </TouchableOpacity>
              
              <View style={styles.activityCounter}>
                <Text style={styles.activityCounterText}>
                  {activityIndex + 1} of {day.activities.length}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.navButton, isLastActivity && styles.navButtonDisabled]}
                disabled={isLastActivity}
                onPress={() => {
                  if (!isLastActivity) {
                    navigation.navigate('ActivityDetails', {
                      tripId: trip.id,
                      dayId: day.id,
                      activityId: day.activities[activityIndex + 1].id
                    });
                  }
                }}
              >
                <MaterialIcons 
                  name="keyboard-arrow-right" 
                  size={24} 
                  color={isLastActivity ? "#ccc" : "#666"} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.featuresContainer}>
            {activity.includesTransportation && (
              <View style={styles.feature}>
                <MaterialCommunityIcons name="bus" size={24} color={theme.colors.primary} />
                <Text style={styles.featureText}>Transportation included</Text>
              </View>
            )}
            
            {activity.includesMeal && (
              <View style={styles.feature}>
                <MaterialCommunityIcons name="food-fork-drink" size={24} color={theme.colors.primary} />
                <Text style={styles.featureText}>Meal included</Text>
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this activity</Text>
            <Text style={styles.description}>{activity.description}</Text>
          </View>
          
          {activity.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notesContainer}>
                <MaterialIcons name="info-outline" size={20} color="#666" style={styles.infoIcon} />
                <Text style={styles.notes}>{activity.notes}</Text>
              </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonAlt: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  noImageHeader: {
    height: 90,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  backButtonNoImage: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
    zIndex: 5,
  },
  contentWithoutImage: {
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  titleContainer: {
    marginBottom: 24,
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
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  timeCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 8,
  },
  dayDate: {
    fontSize: 16,
    color: '#666',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeIcon: {
    marginRight: 8,
  },
  time: {
    fontSize: 16,
    color: '#444',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#f8f8f8',
  },
  activityCounter: {
    alignItems: 'center',
  },
  activityCounterText: {
    fontSize: 14,
    color: '#666',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  notesContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  infoIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  notes: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
});

export default ActivityDetailsScreen; 