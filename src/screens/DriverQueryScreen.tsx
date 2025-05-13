import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import app from '../config/firebase';

interface DriverData {
  acceptance_percentage: number;
  avg_rating: number;
  civil_id: string;
  days_worked: number;
  delivered: number;
  driver_id: string;
  driver_name: string;
  fleet_type: string;
  on_time: number;
  on_time_orders: number;
  org_id: string;
  org_name: string;
  percentage: number;
  rank: string;
  rejected: number;
  timeout: number;
  utr_daily: number;
}

export default function DriverQueryScreen() {
  const [civilId, setCivilId] = useState('');
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchDriver = async () => {
    if (!civilId.trim()) {
      setError('Please enter a Civil ID');
      return;
    }

    setLoading(true);
    setError('');
    setDriverData(null);

    try {
      const db = getFirestore(app);
      const driversRef = collection(db, 'drivers');
      const q = query(driversRef, where('civil_id', '==', civilId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No driver found with this Civil ID');
      } else {
        const data = querySnapshot.docs[0].data() as DriverData;
        setDriverData(data);
      }
    } catch (err) {
      setError('Error fetching driver data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label: string, value: string | number) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}:</Text>
      <Text style={styles.fieldValue}>{value.toString()}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            value={civilId}
            onChangeText={setCivilId}
            placeholder="Tap to enter Civil ID"
            keyboardType="number-pad"
            clearButtonMode="while-editing"
            enablesReturnKeyAutomatically={true}
            returnKeyType="search"
            onSubmitEditing={searchDriver}
          />
          <TouchableOpacity style={styles.button} onPress={searchDriver}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      {driverData && (
        <ScrollView style={styles.dataContainer}>
          {renderField('Driver Name', driverData.driver_name)}
          {renderField('Civil ID', driverData.civil_id)}
          {renderField('Driver ID', driverData.driver_id)}
          {renderField('Rank', driverData.rank)}
          {renderField('Organization', driverData.org_name)}
          {renderField('Fleet Type', driverData.fleet_type)}
          {renderField('Average Rating', driverData.avg_rating.toFixed(2))}
          {renderField('Days Worked', driverData.days_worked)}
          {renderField('Delivered Orders', driverData.delivered)}
          {renderField('On-time Orders', driverData.on_time_orders)}
          {renderField('On-time Percentage', (driverData.on_time * 100).toFixed(2) + '%')}
          {renderField('Acceptance Rate', driverData.acceptance_percentage + '%')}
          {renderField('Overall Percentage', driverData.percentage.toFixed(2) + '%')}
          {renderField('Rejected Orders', driverData.rejected)}
          {renderField('Timeout Orders', driverData.timeout)}
          {renderField('UTR Daily', driverData.utr_daily.toFixed(2))}
        </ScrollView>
      )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dataContainer: {
    flex: 1,
  },
  fieldContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fieldLabel: {
    flex: 1,
    fontWeight: 'bold',
  },
  fieldValue: {
    flex: 2,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
