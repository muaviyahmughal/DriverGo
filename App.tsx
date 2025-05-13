import { StatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import app from './src/config/firebase';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import CustomSplashScreen from './src/screens/SplashScreen';

type Screen = 'driver-login' | 'admin-login' | 'driver-dashboard' | 'admin-dashboard';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('driver-login');
  const [driverData, setDriverData] = useState<any>(null);
  const [adminUsername, setAdminUsername] = useState<string>('');

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make API calls, etc
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [isReady]);

  const handleCustomSplashComplete = () => {
    setShowCustomSplash(false);
  };

  const handleDriverLogin = (data: any) => {
    setDriverData(data);
    setCurrentScreen('driver-dashboard');
  };

  const handleAdminLogin = ({ username }: { username: string; password: string }) => {
    setAdminUsername(username);
    setCurrentScreen('admin-dashboard');
  };

  const handleLogout = () => {
    setDriverData(null);
    setAdminUsername('');
    setCurrentScreen('driver-login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'driver-login':
        return (
          <LoginScreen 
            onLogin={handleDriverLogin}
            onAdminPress={() => setCurrentScreen('admin-login')}
          />
        );
      case 'admin-login':
        return (
          <AdminLoginScreen 
            onBack={() => setCurrentScreen('driver-login')}
            onAdminLogin={handleAdminLogin}
          />
        );
      case 'driver-dashboard':
        return (
          <DashboardScreen 
            driverData={driverData}
            onLogout={handleLogout}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboard 
            username={adminUsername}
            onLogout={handleLogout}
          />
        );
    }
  };

  if (!isReady) {
    return null;
  }

  if (showCustomSplash) {
    return <CustomSplashScreen onAnimationComplete={handleCustomSplashComplete} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});
