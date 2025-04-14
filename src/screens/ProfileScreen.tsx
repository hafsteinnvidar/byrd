import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  Image,
  Text, 
  SafeAreaView,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Mock user data
const mockUser = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@example.com',
  joined: 'April 2021',
  bio: 'Passionate traveler, food enthusiast, and adventure seeker. Always looking for the next amazing experience.',
  location: 'San Francisco, CA',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  trips: 8,
  reviews: 12,
};

// Mock settings items
const settingsItems = [
  {
    id: '1',
    title: 'Personal Information',
    icon: 'person-outline',
    screen: 'PersonalInfo',
  },
  {
    id: '2',
    title: 'Notifications',
    icon: 'notifications-none',
    screen: 'Notifications',
  },
  {
    id: '3',
    title: 'Payment Methods',
    icon: 'credit-card',
    screen: 'PaymentMethods',
  },
  {
    id: '4',
    title: 'Language',
    icon: 'language',
    screen: 'Language',
  },
  {
    id: '5',
    title: 'Help',
    icon: 'help-outline',
    screen: 'Help',
  },
];

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      // The user will be redirected to login automatically due to the auth state change
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
      console.error('Logout error:', error);
    }
  };
  
  // Use the authenticated user's email, or fallback to mock data
  const userEmail = user?.email || mockUser.email;
  const displayName = userEmail.split('@')[0]; // Use the first part of the email as a name
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <MaterialIcons name="settings" size={24} color="#222" />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: mockUser.avatarUrl }} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{userEmail}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{mockUser.trips}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{mockUser.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
          
          {mockUser.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.bioTitle}>About me</Text>
              <Text style={styles.bioText}>{mockUser.bio}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          {settingsItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.settingsItem}>
              <View style={styles.settingsItemIconContainer}>
                <MaterialIcons name={item.icon} size={24} color="#717171" />
              </View>
              <View style={styles.settingsItemContent}>
                <Text style={styles.settingsItemTitle}>{item.title}</Text>
                <MaterialIcons name="chevron-right" size={24} color="#ddd" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#FF385C" style={styles.actionIcon} />
            <Text style={styles.actionText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#717171',
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#717171',
  },
  editProfileButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 15,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#717171',
  },
  bioContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  settingsSection: {
    backgroundColor: '#fff',
    paddingTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  settingsItemIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  settingsItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsItemTitle: {
    fontSize: 16,
    color: '#222',
  },
  actionSection: {
    backgroundColor: '#fff',
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF385C',
  },
});

export default ProfileScreen; 