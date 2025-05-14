import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import app from '../config/firebase';

interface AdminLoginScreenProps {
  onBack: () => void;
  onAdminLogin: (credentials: { username: string; password: string }) => void;
}

export default function AdminLoginScreen({ onBack, onAdminLogin }: AdminLoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const usernameInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    Keyboard.dismiss();

    try {
      const db = getFirestore(app);
      const adminRef = doc(db, 'admins', username);
      const adminDoc = await getDoc(adminRef);

      if (!adminDoc.exists()) {
        setError('Invalid credentials');
        return;
      }

      const adminData = adminDoc.data();
      if (adminData.password !== password) {
        setError('Invalid credentials');
        return;
      }

      onAdminLogin({ username, password });
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Admin Login</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              ref={usernameInputRef}
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
              placeholderTextColor="#666"
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              ref={passwordInputRef}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              placeholderTextColor="#666"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              style={[
                styles.loginButton, 
                (!username.trim() || !password.trim()) && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={loading || !username.trim() || !password.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#F2EDE1" />
              ) : (
                <Text style={styles.loginButtonText}>Login as Admin</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backButton}
              onPress={onBack}
            >
              <Text style={styles.backButtonText}>Back to Driver Login</Text>
            </TouchableOpacity>

            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Login Requirements:</Text>
              <Text style={styles.requirementsText}>
                • Username must match exactly{'\n'}
                • Password is case-sensitive{'\n'}
                • No extra spaces allowed{'\n'}
                • Both fields are required
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F2EDE1',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
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
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#2FA166',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
    color: '#333',
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
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#F2EDE1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#2FA166',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  requirementsContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: 'rgba(47, 161, 102, 0.1)',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2FA166',
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  requirementsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
