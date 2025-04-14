import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput as RNTextInput, ActivityIndicator, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await signIn(email, password);
      
      if (error) {
        Alert.alert('Error', error.message || 'Failed to sign in');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    // Navigate to register screen when implemented
    Alert.alert('Sign Up', 'Create an account to continue');
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen when implemented
    Alert.alert('Forgot Password', 'We\'ll send you a password reset link');
  };

  return (
    <ImageBackground
      source={require('../assets/byrd-bg.png')}
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
                  editable={!isLoading}
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
                    editable={!isLoading}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
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
                <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              
              <Button 
                mode="contained" 
                onPress={handleLogin} 
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
                labelStyle={styles.loginButtonText}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#333" />
                ) : (
                  'Login'
                )}
              </Button>
              
              <View style={styles.signUpContainer}>
                <Text style={styles.noAccountText}>Don't have an account?</Text>
                <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
                  <Text style={styles.signUpText}>Sign up</Text>
                </TouchableOpacity>
              </View>
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  noAccountText: {
    color: '#ffffff',
    fontSize: 14,
    marginRight: 5,
  },
  signUpText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;