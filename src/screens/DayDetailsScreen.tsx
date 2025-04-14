import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Text, Animated, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation';
import { mockTrips } from '../mockData/tripData';
import { Trip, DayItinerary } from '../types';

type DayDetailsRouteProp = RouteProp<RootStackParamList, 'DayDetails'>;

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 300;

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
  
  // Handle scroll event
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

  const imageScale = scrollY.interpolate({
    inputRange: [-300, 0],
    outputRange: [1.5, 1],
    extrapolateLeft: 'extend',
    extrapolateRight: 'clamp',
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
      <Animated.View style={styles.imageContainer}>
        <Animated.Image 
          source={{ uri: day.imageUrl || trip.coverImageUrl }} 
          style={[
            styles.image,
            { transform: [{ scale: imageScale }] }
          ]} 
        />
        <View style={styles.imageDarkOverlay} />
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
      
      <TouchableOpacity 
        style={styles.backButtonAlt}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            <View style={styles.dateHeader}>
              <View>
                <Text style={styles.dayNumber}>Day {dayIndex + 1}</Text>
                <Text style={styles.date}>{formattedDate}</Text>
              </View>
              <View style={styles.dayBadge}>
                <Text style={styles.dayCount}>{dayIndex + 1}/{trip.days.length}</Text>
              </View>
            </View>
            
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
                  name="arrow-back-ios" 
                  size={16} 
                  color={isFirstDay ? "#ccc" : "#666"} 
                />
                <Text style={[styles.navButtonText, isFirstDay && styles.navButtonTextDisabled]}>
                  Previous
                </Text>
              </TouchableOpacity>
              
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
                  Next
                </Text>
                <MaterialIcons 
                  name="arrow-forward-ios" 
                  size={16} 
                  color={isLastDay ? "#ccc" : "#666"} 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.activitiesSection}>
              <Text style={styles.sectionTitle}>Activities</Text>
              
              {day.activities.length > 0 ? (
                <View style={styles.timeline}>
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
                      <View style={styles.timeColumn}>
                        <Text style={styles.activityTime}>{activity.startTime}</Text>
                        <View style={styles.timelineDot} />
                        {index < day.activities.length - 1 && (
                          <View style={styles.timelineConnector} />
                        )}
                      </View>
                      
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{activity.title}</Text>
                        <View style={styles.activityDetails}>
                          <View style={styles.activityDetail}>
                            <MaterialIcons name="access-time" size={14} color="#666" />
                            <Text style={styles.activityDetailText}>
                              {activity.startTime} - {activity.endTime}
                            </Text>
                          </View>
                          <View style={styles.activityDetail}>
                            <MaterialIcons name="location-on" size={14} color="#666" />
                            <Text style={styles.activityDetailText}>{activity.location}</Text>
                          </View>
                        </View>
                        
                        {activity.imageUrl && (
                          <Image source={{ uri: activity.imageUrl }} style={styles.activityImage} />
                        )}
                        
                        <Text style={styles.activityDescription} numberOfLines={2}>
                          {activity.description}
                        </Text>
                        
                        <View style={styles.viewDetailsButton}>
                          <Text style={styles.viewDetailsText}>View details</Text>
                          <MaterialIcons name="arrow-forward-ios" size={12} color="#FF385C" />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <MaterialIcons name="event-busy" size={60} color="#ddd" />
                  <Text style={styles.emptyText}>No activities scheduled for this day</Text>
                  <Text style={styles.emptySubtext}>Enjoy your free time or explore on your own</Text>
                </View>
              )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT - 30,
  },
  contentWrapper: {
    marginTop: -30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: Dimensions.get('window').height - HEADER_HEIGHT + 50,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 16,
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
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dayNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  dayBadge: {
    backgroundColor: '#FF385C',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dayCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  navButtonDisabled: {
    backgroundColor: '#f0f0f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginHorizontal: 6,
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  activitiesSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
  },
  timeline: {
    paddingLeft: 8,
  },
  activityCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeColumn: {
    width: 60,
    alignItems: 'center',
    marginRight: 16,
  },
  activityTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF385C',
    marginTop: 4,
    marginBottom: 8,
    zIndex: 2,
  },
  timelineConnector: {
    width: 2,
    backgroundColor: '#e0e0e0',
    height: '100%',
    position: 'absolute',
    top: 28,
    left: 30,
    bottom: 0,
  },
  activityContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  activityDetails: {
    marginBottom: 12,
  },
  activityDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  activityDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  activityImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#FF385C',
    fontWeight: '600',
    marginRight: 4,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DayDetailsScreen; 