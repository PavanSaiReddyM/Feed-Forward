import { StyleSheet, Text, View, ScrollView } from 'react-native';

const ActiveDonations = () => {
  const donations = [
    { id: 1, name: 'Rice & Curry', quantity: '15 kg', status: 'Waiting' },
    { id: 2, name: 'Fresh Vegetables', quantity: '8 kg', status: 'Scheduled' },
    { id: 3, name: 'Bread & Pastries', quantity: '5 kg', status: 'Waiting' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Donations</Text>
      </View>

      <ScrollView style={styles.list}>
        {donations.length > 0 ? (
          donations.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No active donations</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const DonationCard = ({ donation }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardIcon}>🍽️</Text>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{donation.name}</Text>
        <Text style={styles.cardQuantity}>{donation.quantity}</Text>
      </View>
      <View style={[
        styles.statusBadge,
        donation.status === 'Scheduled' && styles.statusScheduled
      ]}>
        <Text style={styles.statusText}>{donation.status}</Text>
      </View>
    </View>
  </View>
);

export default ActiveDonations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardQuantity: {
    fontSize: 14,
    opacity: 0.6,
  },
  statusBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusScheduled: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
  },
});
