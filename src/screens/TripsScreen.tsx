import React from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { mockTrips } from '../mockData/tripData';
import { MaterialIcons } from '@expo/vector-icons';
import { Trip } from '../types';

type TripsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const TripsScreen = () => {
  const navigation = useNavigation<TripsScreenNavigationProp>();

  const renderTripCard = ({ item }: { item: Trip }) => {
    const startDate = new Date(item.startDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const endDate = new Date(item.endDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('TripDetails', { tripId: item.id })}
        style={styles.card}
      >
        <View style={styles.cardTag}>
          <Text style={styles.cardTagText}>Upcoming</Text>
        </View>
        
        <Image source={{ uri: item.coverImageUrl }} style={styles.cardImage} />
        
        <View style={styles.cardContent}>
          <Text style={styles.destination}>{item.destination}</Text>
          <Text style={styles.tripTitle}>{item.title}</Text>
          
          <Text style={styles.hostedBy}>
            Hosted by {item.travelAgency}
          </Text>
          
          <Text style={styles.dates}>
            {startDate} – {endDate}
          </Text>
          
          <View style={styles.userIcons}>
            <View style={styles.userIcon}>
              <MaterialIcons name="person" size={20} color="#fff" />
            </View>
            <View style={[styles.userIcon, styles.userIconOffset]}>
              <MaterialIcons name="person" size={20} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trips</Text>
      </View>
      
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Upcoming reservations</Text>
      </View>
      
      <View style={styles.container}>
        {mockTrips.length > 0 ? (
          <FlatList
            data={mockTrips}
            renderItem={renderTripCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="card-travel" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No trips found</Text>
            <Text style={styles.emptySubText}>Your upcoming trips will appear here</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
  },
  subHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  subHeaderTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#222',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 20,
  },
  card: {
    marginBottom: 28,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cardTagText: {
    color: '#222',
    fontSize: 12,
    fontWeight: '600',
  },
  cardImage: {
    height: 200,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  destination: {
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  hostedBy: {
    fontSize: 14,
    color: '#717171',
    marginBottom: 4,
  },
  dates: {
    fontSize: 14,
    color: '#717171',
    marginBottom: 16,
  },
  userIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconOffset: {
    marginLeft: -10,
    backgroundColor: '#00A699',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#222',
  },
  emptySubText: {
    fontSize: 14,
    color: '#717171',
    textAlign: 'center',
  },
});

export default TripsScreen; 