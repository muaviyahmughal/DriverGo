import { StatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import { useState } from 'react';
import app from './src/config/firebase';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminDashboard from './src/screens/AdminDashboard';

type Screen = 'driver-login' | 'admin-login' | 'driver-dashboard' | 'admin-dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('driver-login');
  const [driverData, setDriverData] = useState<any>(null);
  const [adminUsername, setAdminUsername] = useState<string>('');

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
    backgroundColor: '#F2EDE1',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});