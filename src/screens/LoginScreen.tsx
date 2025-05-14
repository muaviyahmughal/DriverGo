import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Modal
} from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import app from '../config/firebase';
import { saveDriverCivilId, getSavedCivilId, clearSavedCivilId } from '../storage/auth';

interface LoginScreenProps {
  onLogin: (driverData: any) => void;
  onAdminPress: () => void;
}

export default function LoginScreen({ onLogin, onAdminPress }: LoginScreenProps) {
  const [civilId, setCivilId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleCivilIdChange = (text: string) => {
    // Only allow digits and limit to 12 characters
    const numericOnly = text.replace(/[^0-9]/g, '');
    if (numericOnly.length <= 12) {
      setCivilId(numericOnly);
    }
  };

  useEffect(() => {
    loadSavedCivilId();
  }, []);

  const loadSavedCivilId = async () => {
    const savedId = await getSavedCivilId();
    if (savedId) {
      setCivilId(savedId);
      setRememberMe(true);
    }
  };

  const handleLogin = async () => {
    if (!civilId.trim()) {
      setError('Please enter your Civil ID');
      return;
    }

    if (civilId.length !== 12) {
      setError('Civil ID must be 12 digits');
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
        if (rememberMe) {
          await saveDriverCivilId(civilId);
        } else {
          await clearSavedCivilId();
        }
        onLogin(driverData);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const HelpModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showHelp}
      onRequestClose={() => setShowHelp(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowHelp(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Civil ID Format</Text>
            <Text style={styles.modalText}>
              • Enter your 12-digit Civil ID number{'\n'}
              • Example: 292624047141{'\n'}
              • Only numbers are allowed{'\n'}
              • Must be exactly 12 digits
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowHelp(false)}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

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
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={civilId}
              onChangeText={handleCivilIdChange}
              placeholder="Enter 12-digit Civil ID"
              keyboardType="number-pad"
              clearButtonMode="while-editing"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              placeholderTextColor="#666"
              maxLength={12}
            />
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => setShowHelp(true)}
            >
              <Text style={styles.helpButtonText}>?</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.rememberContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Remember Me</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.loginButton,
              civilId.length !== 12 && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={loading || civilId.length !== 12}
          >
            {loading ? (
              <ActivityIndicator color="#F2EDE1" />
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

        <HelpModal />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EDE1',
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#2FA166',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
    color: '#333',
    letterSpacing: 1,
  },
  helpButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2FA166',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 15,
  },
  helpButtonText: {
    color: '#F2EDE1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#2FA166',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2FA166',
  },
  checkmark: {
    color: '#F2EDE1',
    fontSize: 14,
  },
  rememberText: {
    color: '#333',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#2FA166',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#2FA166',
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#F2EDE1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adminButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  adminButtonText: {
    color: '#2FA166',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F2EDE1',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#2FA166',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#F2EDE1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
