import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StatusBar, 
  Text, 
  SafeAreaView,
  FlatList,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { mockTrips } from '../mockData/tripData';
import { MaterialIcons } from '@expo/vector-icons';

type ExploreScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

// Get device width to set consistent card width
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7; // 70% of screen width

// Mock categories for the explore screen
const exploreCategories = [
  {
    id: '1',
    title: 'Trips',
    icon: 'flight',
    color: '#FF385C',
  },
  {
    id: '3',
    title: 'Restaurants',
    icon: 'restaurant',
    color: '#FF5A5F',
  },
  {
    id: '4',
    title: 'Experiences',
    icon: 'local-activity',
    color: '#914669',
  },
];

// Mock featured experiences
const featuredExperiences = [
  {
    id: '1',
    title: 'Historic City Tour',
    location: 'Rome, Italy',
    rating: 4.9,
    reviews: 128,
    price: 49,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
    duration: '3 hours',
  },
  {
    id: '2',
    title: 'Cooking Class',
    location: 'Paris, France',
    rating: 4.8,
    reviews: 86,
    price: 65,
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745adc4b',
    duration: '2 hours',
  },
  {
    id: '3',
    title: 'Snorkeling Adventure',
    location: 'Bali, Indonesia',
    rating: 4.7,
    reviews: 215,
    price: 38,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
    duration: '4 hours',
  },
];

// Mock restaurants
const restaurants = [
  {
    id: '1',
    name: 'Dill Restaurant',
    cuisine: 'Nordic',
    rating: 4.8,
    reviews: 342,
    priceLevel: '$$$$',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
  },
  {
    id: '2',
    name: 'Matur og Drykkur',
    cuisine: 'Icelandic',
    rating: 4.6,
    reviews: 187,
    priceLevel: '$$$',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
  },
  {
    id: '3',
    name: 'Fiskfélagið',
    cuisine: 'Seafood',
    rating: 4.7,
    reviews: 521,
    priceLevel: '$$$',
    imageUrl: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b',
  },
];

const ExploreScreen = () => {
  const navigation = useNavigation<ExploreScreenNavigationProp>();

  const handleCategoryPress = (categoryTitle) => {
    if (categoryTitle === 'Restaurants') {
      navigation.navigate('RestaurantsList');
    } else if (categoryTitle === 'Trips') {
      navigation.navigate('Trips');
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem} 
      onPress={() => handleCategoryPress(item.title)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <MaterialIcons name={item.icon} size={24} color="#fff" />
      </View>
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderTripItem = ({ item }) => {
    const startDate = new Date(item.startDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const endDate = new Date(item.endDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => navigation.navigate('TripDetails', { tripId: item.id })}
      >
        <Image source={{ uri: item.coverImageUrl }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.tripDestination}>{item.destination}</Text>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.tripDates}>
            {startDate} - {endDate}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderExperienceItem = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.experienceBadge}>
        <Text style={styles.experienceDuration}>{item.duration}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FF385C" />
          <Text style={styles.rating}>{item.rating} ({item.reviews})</Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.location}</Text>
        <Text style={styles.experiencePrice}>From ${item.price} / person</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={() => navigation.navigate('RestaurantDetails', { restaurant: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.cuisine}</Text>
        <View style={styles.restaurantDetails}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={14} color="#FF385C" />
            <Text style={styles.restaurantRating}>{item.rating} ({item.reviews})</Text>
          </View>
          <Text style={styles.priceLevel}>{item.priceLevel}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <FlatList
            data={exploreCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        
        {/* Your Trips Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Trips</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Trips')}>
              <Text style={styles.seeAllButton}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={mockTrips.slice(0, 2)}
            renderItem={renderTripItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
        
        {/* Recommended Experiences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Experiences</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredExperiences}
            renderItem={renderExperienceItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
        
        {/* Restaurants Near You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Restaurants Near You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RestaurantsList')}>
              <Text style={styles.seeAllButton}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={restaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  categoriesContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 32,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    color: '#222',
    fontWeight: '500',
  },
  section: {
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#FF385C',
    fontWeight: '500',
  },
  horizontalList: {
    paddingLeft: 20,
    paddingRight: 12,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 6,
    marginTop: 4,
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginVertical: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#717171',
    marginBottom: 4,
  },
  tripDestination: {
    fontSize: 14,
    color: '#717171',
  },
  tripDates: {
    fontSize: 14,
    color: '#717171',
  },
  experienceBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  experienceDuration: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#222',
    marginLeft: 4,
  },
  experiencePrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  restaurantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantRating: {
    fontSize: 14,
    color: '#222',
    marginLeft: 4,
  },
  priceLevel: {
    fontSize: 14,
    color: '#717171',
  },
});

export default ExploreScreen; 