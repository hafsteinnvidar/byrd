import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { Navigation } from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#f4511e',
    accent: '#f1c40f',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <StatusBar style="auto" />
          <Navigation />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
