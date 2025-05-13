import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import app from '../config/firebase';

interface LoginScreenProps {
  onLogin: (driverData: any) => void;
  onAdminPress: () => void;
}

export default function LoginScreen({ onLogin, onAdminPress }: LoginScreenProps) {
  const [civilId, setCivilId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!civilId.trim()) {
      setError('Please enter your Civil ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const db = getFirestore(app);
      const driversRef = collection(db, 'drivers');
      const q = query(driversRef, where('civil_id', '==', civilId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Invalid Civil ID');
      } else {
        const driverData = querySnapshot.docs[0].data();
        onLogin(driverData);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Driver Login</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={civilId}
            onChangeText={setCivilId}
            placeholder="Enter Civil ID"
            keyboardType="number-pad"
            clearButtonMode="while-editing"
            returnKeyType="go"
            onSubmitEditing={handleLogin}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Driver Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.adminButton}
            onPress={onAdminPress}
          >
            <Text style={styles.adminButtonText}>Login as Admin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  adminButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  adminButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 10,
  },
});
