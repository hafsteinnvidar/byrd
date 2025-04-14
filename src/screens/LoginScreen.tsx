import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { MaterialIcons } from '@expo/vector-icons';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = () => {
    // Will be replaced with Supabase authentication later
    // For now, navigate to main tabs with any input
    navigation.navigate('MainTabs');
  };

  return (
    <ImageBackground
      source={require('../../assets/byrd-bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>BYRD</Text>
            
            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              
              <View style={styles.inputContainer}>
                <RNTextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Email Address"
                  placeholderTextColor="#fff"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <View style={styles.passwordContainer}>
                  <RNTextInput
                    value={password}
                    onChangeText={setPassword}
                    style={styles.passwordInput}
                    secureTextEntry={!showPassword}
                    placeholder="Password"
                    placeholderTextColor="#fff"
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons 
                      name={showPassword ? "visibility" : "visibility-off"} 
                      size={24} 
                      color="white" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              
              <Button 
                mode="contained" 
                onPress={handleLogin} 
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
                labelStyle={styles.loginButtonText}
              >
                Login
              </Button>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 60,
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    height: 50,
    color: '#ffffff',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#ffffff',
    paddingHorizontal: 16,
    fontSize: 14,
    height: '100%',
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  forgotPassword: {
    color: '#ffffff',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  loginButtonContent: {
    height: 50,
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;