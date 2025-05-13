import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

interface DashboardScreenProps {
  driverData: {
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
  };
  onLogout: () => void;
}

export default function DashboardScreen({ driverData, onLogout }: DashboardScreenProps) {
  const StatCard = ({ title, value, suffix = '' }: { title: string; value: number | string; suffix?: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{typeof value === 'number' ? value.toFixed(2) : value}{suffix}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.driverName}>{driverData.driver_name}</Text>
            <Text style={styles.driverId}>ID: {driverData.driver_id}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rankCard}>
          <Text style={styles.rankTitle}>Current Rank</Text>
          <Text style={styles.rankValue}>{driverData.rank}</Text>
          <Text style={styles.orgName}>{driverData.org_name}</Text>
        </View>

        <Text style={styles.sectionTitle}>Performance Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard title="Rating" value={driverData.avg_rating} suffix="/5" />
          <StatCard title="Days Worked" value={driverData.days_worked} />
          <StatCard title="Overall %" value={driverData.percentage} suffix="%" />
          <StatCard title="UTR Daily" value={driverData.utr_daily} />
        </View>

        <Text style={styles.sectionTitle}>Delivery Statistics</Text>
        <View style={styles.statsGrid}>
          <StatCard title="Delivered" value={driverData.delivered} />
          <StatCard title="On-time" value={driverData.on_time_orders} />
          <StatCard title="On-time %" value={driverData.on_time * 100} suffix="%" />
          <StatCard title="Acceptance" value={driverData.acceptance_percentage} suffix="%" />
        </View>

        <View style={styles.additionalInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fleet Type:</Text>
            <Text style={styles.infoValue}>{driverData.fleet_type}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Civil ID:</Text>
            <Text style={styles.infoValue}>{driverData.civil_id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Organization ID:</Text>
            <Text style={styles.infoValue}>{driverData.org_id}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingRight: 8,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  driverName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  driverId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  logoutText: {
    color: '#007AFF',
    fontSize: 16,
  },
  rankCard: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  rankTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 8,
  },
  rankValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orgName: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  additionalInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
