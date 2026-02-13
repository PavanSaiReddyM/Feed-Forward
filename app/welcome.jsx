import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const Welcome = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>

        {/* Floating Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🍽️</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Food Waste{"\n"}Management
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Connecting donors with those in need
        </Text>

        {/* Features */}
        <View style={styles.features}>
          <Feature emoji="🤝" label="Connect" />
          <Feature emoji="📍" label="Locate" />
          <Feature emoji="❤️" label="Share" />
        </View>

      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.85}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          activeOpacity={0.85}
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.signupButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.demoButton}
          activeOpacity={0.85}
          onPress={() => router.push('/donor/dashboard')}
        >
          <Text style={styles.demoButtonText}>🎯 View Donor Demo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Feature = ({ emoji, label }) => (
  <View style={styles.feature}>
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{emoji}</Text>
    </View>
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

export default Welcome;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3E0',
    justifyContent: 'space-between',
  },

  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },

  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },

  icon: {
    fontSize: 60,
  },

  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#E65100',
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: '#F57C00',
    textAlign: 'center',
    marginBottom: 40,
  },

  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
  },

  feature: {
    alignItems: 'center',
  },

  featureCard: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },

  featureIcon: {
    fontSize: 26,
  },

  featureText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#F57C00',
  },

  buttonContainer: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },

  loginButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 18,
    borderRadius: 22,
    marginBottom: 16,

    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },

  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  signupButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#FF9800',
  },

  signupButtonText: {
    color: '#FF9800',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  demoButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 18,
    borderRadius: 22,
    marginTop: 8,
  },

  demoButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
