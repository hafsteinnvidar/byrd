import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation';

type RestaurantsListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock data for Icelandic restaurants
const icelandicRestaurants = [
  {
    id: '1',
    name: 'Dill Restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000',
    description: 'Iceland\'s first Michelin-starred restaurant, focusing on Nordic cuisine with local ingredients.',
    location: 'Reykjavík',
    discount: '15%',
    priceCategory: '$$$$',
    cuisine: 'Nordic',
    rating: 4.8,
    phoneNumber: '+354 552 1522',
    openingHours: 'Wed-Sat: 18:00-22:00',
    bookingInstructions: 'Booking required at least 1 month in advance. Call or book online.',
    website: 'dillrestaurant.is',
  },
  {
    id: '2',
    name: 'Matur og Drykkur',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000',
    description: 'Traditional Icelandic cuisine with a modern twist. Famous for their cod head and lamb dishes.',
    location: 'Reykjavík',
    discount: '10%',
    priceCategory: '$$$',
    cuisine: 'Icelandic',
    rating: 4.6,
    phoneNumber: '+354 571 8877',
    openingHours: 'Mon-Sun: 17:30-22:00',
    bookingInstructions: 'Reservations recommended. Call or book online.',
    website: 'maturogdrykkur.is',
  },
  {
    id: '3',
    name: 'Fiskfélagið (Fish Company)',
    image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=1000',
    description: 'Seafood restaurant offering a "world tour" menu with Icelandic ingredients and international flavors.',
    location: 'Reykjavík',
    discount: '20%',
    priceCategory: '$$$',
    cuisine: 'Seafood',
    rating: 4.7,
    phoneNumber: '+354 552 5300',
    openingHours: 'Mon-Sun: 11:30-14:00, 18:00-23:00',
    bookingInstructions: 'Reservations highly recommended for dinner. Call or book online.',
    website: 'fishcompany.is',
  },
  {
    id: '4',
    name: 'Fjöruhúsið',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000',
    description: 'Cozy restaurant in the Westfjords serving fresh seafood soup and homemade bread.',
    location: 'Ísafjörður',
    discount: '15%',
    priceCategory: '$$',
    cuisine: 'Seafood',
    rating: 4.9,
    phoneNumber: '+354 456 3879',
    openingHours: 'Seasonal (Jun-Aug): Daily 12:00-21:00',
    bookingInstructions: 'Reservations recommended during summer. Call in advance.',
    website: 'fjoruhusid.is',
  },
  {
    id: '5',
    name: 'Slippurinn',
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1000',
    description: 'Family-run seasonal restaurant in the Westman Islands focusing on locally sourced ingredients.',
    location: 'Vestmannaeyjar',
    discount: '10%',
    priceCategory: '$$$',
    cuisine: 'Modern Icelandic',
    rating: 4.7,
    phoneNumber: '+354 481 3085',
    openingHours: 'Seasonal (May-Sep): Daily 18:00-22:00',
    bookingInstructions: 'Reservations essential. Book online or by phone.',
    website: 'slippurinn.com',
  },
  {
    id: '6',
    name: 'Bæjarins Beztu Pylsur',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1000',
    description: 'Famous hot dog stand visited by celebrities and tourists alike. A true Icelandic experience.',
    location: 'Reykjavík',
    discount: '5%',
    priceCategory: '$',
    cuisine: 'Fast Food',
    rating: 4.5,
    phoneNumber: 'N/A',
    openingHours: 'Mon-Thu: 10:00-01:00, Fri-Sat: 10:00-04:30, Sun: 10:00-01:00',
    bookingInstructions: 'No reservation needed. Cash and cards accepted.',
    website: 'bbp.is',
  },
];

const RestaurantsListScreen = () => {
  const navigation = useNavigation<RestaurantsListScreenNavigationProp>();

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => navigation.navigate('RestaurantDetails', { restaurant: item })}
    >
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        
        <View style={styles.restaurantDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="restaurant" size={16} color="#666" />
            <Text style={styles.detailText}>{item.cuisine}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="attach-money" size={16} color="#666" />
            <Text style={styles.detailText}>{item.priceCategory}</Text>
          </View>
        </View>
        
        <Text style={styles.restaurantDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.discountContainer}>
          <MaterialIcons name="local-offer" size={16} color="#FF385C" />
          <Text style={styles.discountText}>
            {item.discount} discount with BYRD
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Icelandic Restaurants</Text>
      </View>
      
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        data={icelandicRestaurants}
        keyExtractor={item => item.id}
        renderItem={renderRestaurantItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  restaurantCard: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    marginTop: 4,
  },
  restaurantImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#222',
  },
  restaurantDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginBottom: 12,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  discountText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#FF385C',
  },
});

export default RestaurantsListScreen; 