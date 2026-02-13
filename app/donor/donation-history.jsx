import { StyleSheet, Text, View, ScrollView } from 'react-native';

const DonationHistory = () => {
  const history = [
    { id: 1, date: '2024-01-15', name: 'Cooked Rice', quantity: '20 kg', ngo: 'Hope Foundation' },
    { id: 2, date: '2024-01-12', name: 'Fresh Fruits', quantity: '12 kg', ngo: 'Care NGO' },
    { id: 3, date: '2024-01-10', name: 'Packaged Food', quantity: '18 kg', ngo: 'Food Bank' },
    { id: 4, date: '2024-01-08', name: 'Vegetables', quantity: '15 kg', ngo: 'Hope Foundation' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Donation History</Text>
      </View>

      <ScrollView style={styles.list}>
        {history.map((item) => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const HistoryCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.dateIcon}>📅</Text>
      <Text style={styles.date}>{item.date}</Text>
      <View style={styles.completedBadge}>
        <Text style={styles.completedText}>✓ Completed</Text>
      </View>
    </View>
    
    <View style={styles.cardBody}>
      <View style={styles.infoRow}>
        <Text style={styles.foodIcon}>🍽️</Text>
        <View style={styles.infoContent}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.quantity}>{item.quantity}</Text>
        </View>
      </View>
      
      <View style={styles.ngoRow}>
        <Text style={styles.ngoIcon}>🏢</Text>
        <Text style={styles.ngoName}>{item.ngo}</Text>
      </View>
    </View>
  </View>
);

export default DonationHistory;

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
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  date: {
    flex: 1,
    fontSize: 14,
    opacity: 0.6,
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  cardBody: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  quantity: {
    fontSize: 14,
    opacity: 0.6,
  },
  ngoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ngoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  ngoName: {
    fontSize: 14,
    opacity: 0.7,
  },
});
