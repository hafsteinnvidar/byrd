import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView, 
  Linking, 
  Platform,
  Share,
  Animated
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation';

type RestaurantDetailsRouteProp = RouteProp<RootStackParamList, 'RestaurantDetails'>;

const RestaurantDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RestaurantDetailsRouteProp>();
  const { restaurant } = route.params;
  const scrollY = new Animated.Value(0);

  const handleCall = () => {
    if (restaurant.phoneNumber !== 'N/A') {
      Linking.openURL(`tel:${restaurant.phoneNumber}`);
    }
  };

  const handleWebsite = () => {
    Linking.openURL(`https://${restaurant.website}`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${restaurant.name} in ${restaurant.location}, Iceland! They offer a ${restaurant.discount} discount with BYRD. ${restaurant.description}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: restaurant.image }} 
            style={styles.restaurantImage} 
          />
          <View style={styles.imageDarkOverlay} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.restaurantHeader}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={18} color="#FFD700" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
          </View>
          
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <MaterialIcons name="restaurant" size={14} color="#444" />
              <Text style={styles.tagText}>{restaurant.cuisine}</Text>
            </View>
            
            <View style={styles.tag}>
              <MaterialIcons name="attach-money" size={14} color="#444" />
              <Text style={styles.tagText}>{restaurant.priceCategory}</Text>
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={18} color="#666" />
            <Text style={styles.locationText}>{restaurant.location}, Iceland</Text>
          </View>
          
          <View style={styles.discountBanner}>
            <MaterialIcons name="local-offer" size={20} color="#fff" />
            <Text style={styles.discountText}>
              {restaurant.discount} discount with BYRD
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.descriptionText}>{restaurant.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={handleCall}
              disabled={restaurant.phoneNumber === 'N/A'}
            >
              <MaterialIcons name="phone" size={20} color="#666" />
              <Text style={[
                styles.contactText, 
                restaurant.phoneNumber === 'N/A' && styles.disabledText
              ]}>
                {restaurant.phoneNumber}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={handleWebsite}
            >
              <MaterialIcons name="language" size={20} color="#666" />
              <Text style={styles.contactText}>{restaurant.website}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opening Hours</Text>
            <Text style={styles.hoursText}>{restaurant.openingHours}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Instructions</Text>
            <Text style={styles.bookingText}>{restaurant.bookingInstructions}</Text>
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={handleCall}
              disabled={restaurant.phoneNumber === 'N/A'}
            >
              <MaterialIcons name="phone" size={20} color="#fff" />
              <Text style={styles.buttonText}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleShare}
            >
              <MaterialIcons name="share" size={20} color="#FF385C" />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageContainer: {
    height: 300,
    width: '100%',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
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
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  tagText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#444',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#666',
  },
  discountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF385C',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  discountText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#444',
  },
  disabledText: {
    color: '#aaa',
  },
  hoursText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  bookingText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF385C',
    flex: 1,
    marginHorizontal: 6,
  },
  primaryButton: {
    backgroundColor: '#FF385C',
    borderColor: '#FF385C',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF385C',
  },
});

export default RestaurantDetailsScreen; 