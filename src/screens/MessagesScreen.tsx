import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  SafeAreaView,
  TextInput
} from 'react-native';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';

type MessagesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ConversationRouteProp = RouteProp<RootStackParamList, 'Conversation'>;

// Mock conversation data
const mockConversations = [
  {
    id: '1',
    name: 'Reykjavik Tours',
    avatar: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?q=80&w=256',
    lastMessage: 'Your Northern Lights tour is confirmed for tomorrow at 8 PM!',
    time: '10:34 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Dill Restaurant',
    avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=256',
    lastMessage: 'Your reservation for 2 people on Friday at 7 PM is confirmed.',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    name: 'Blue Lagoon',
    avatar: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?q=80&w=256',
    lastMessage: 'We look forward to welcoming you next week. Don\'t forget to bring your swimsuit!',
    time: 'Apr 12',
    unread: 0,
  },
  {
    id: '4',
    name: 'Glacier Tours',
    avatar: 'https://images.unsplash.com/photo-1551415923-a2297c7fda79?q=80&w=256',
    lastMessage: 'Due to weather conditions, your ice cave tour has been rescheduled to Thursday.',
    time: 'Apr 10',
    unread: 1,
  },
  {
    id: '5',
    name: 'Slippurinn Restaurant',
    avatar: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=256',
    lastMessage: 'Would you like to add a special request to your booking?',
    time: 'Apr 8',
    unread: 0,
  },
];

// Mock messages for conversation details
const mockMessages = {
  '1': [
    { id: '1', text: 'Hello! Welcome to Iceland. Your Northern Lights tour is scheduled for tomorrow.', sender: 'them', time: '10:00 AM' },
    { id: '2', text: 'Thank you! What time should we be ready?', sender: 'me', time: '10:15 AM' },
    { id: '3', text: 'Your Northern Lights tour is confirmed for tomorrow at 8 PM! We\'ll pick you up at your hotel.', sender: 'them', time: '10:34 AM' },
  ],
  '2': [
    { id: '1', text: 'Hi, I\'d like to make a reservation for Friday evening.', sender: 'me', time: 'Yesterday' },
    { id: '2', text: 'Good day! We have availability at 7 PM for Friday. How many people will be dining?', sender: 'them', time: 'Yesterday' },
    { id: '3', text: 'Just 2 people, please.', sender: 'me', time: 'Yesterday' },
    { id: '4', text: 'Your reservation for 2 people on Friday at 7 PM is confirmed.', sender: 'them', time: 'Yesterday' },
  ],
  '3': [
    { id: '1', text: 'We look forward to welcoming you next week. Don\'t forget to bring your swimsuit!', sender: 'them', time: 'Apr 12' },
  ],
  '4': [
    { id: '1', text: 'Hello, is my ice cave tour still happening tomorrow?', sender: 'me', time: 'Apr 10' },
    { id: '2', text: 'Due to weather conditions, your ice cave tour has been rescheduled to Thursday.', sender: 'them', time: 'Apr 10' },
  ],
  '5': [
    { id: '1', text: 'Would you like to add a special request to your booking?', sender: 'them', time: 'Apr 8' },
  ],
};

const MessagesScreen = () => {
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const route = useRoute();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  
  // Check if we're in conversation detail view
  const inConversation = route.name === 'Conversation';
  const conversationId = inConversation ? (route as ConversationRouteProp).params.conversationId : null;
  const currentConversation = conversationId ? mockConversations.find(c => c.id === conversationId) : null;
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // In a real app, we would send this to a backend
    alert(`Message "${newMessage}" sent!`);
    setNewMessage('');
  };
  
  const handleBackToMessages = () => {
    // Use goBack() instead of navigate to return to the previous screen
    navigation.goBack();
  };

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => navigation.navigate('Conversation', { conversationId: item.id })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.conversationTime}>{item.time}</Text>
        </View>
        
        <View style={styles.messagePreviewContainer}>
          <Text 
            style={[
              styles.messagePreview, 
              item.unread > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }) => (
    <View style={[
      styles.messageItem,
      item.sender === 'me' ? styles.myMessage : styles.theirMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'me' ? styles.myMessageText : styles.theirMessageText
      ]}>
        {item.text}
      </Text>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  if (inConversation && currentConversation) {
    const messages = mockMessages[conversationId!] || [];
    
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.conversationHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToMessages}
          >
            <MaterialIcons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          
          <View style={styles.conversationTitleContainer}>
            <Image source={{ uri: currentConversation.avatar }} style={styles.smallAvatar} />
            <Text style={styles.conversationTitle}>{currentConversation.name}</Text>
          </View>
        </View>
        
        <FlatList
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessageItem}
          inverted={false}
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={newMessage.trim() === ''}
          >
            <MaterialIcons 
              name="send" 
              size={24} 
              color={newMessage.trim() === '' ? '#ccc' : '#FF385C'} 
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        data={mockConversations}
        keyExtractor={item => item.id}
        renderItem={renderConversationItem}
        showsVerticalScrollIndicator={false}
      />
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
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  conversationTime: {
    fontSize: 12,
    color: '#999',
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messagePreview: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#222',
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF385C',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  // Conversation detail styles
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  conversationTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  conversationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messagesContent: {
    padding: 16,
  },
  messageItem: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF385C',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  theirMessageText: {
    color: '#222',
  },
  myMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 24,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sendButton: {
    padding: 12,
    marginLeft: 8,
  },
});

export default MessagesScreen; 