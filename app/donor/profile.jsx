import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function DonorProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("Pavan Moola");
  const [email, setEmail] = useState("pavanmoola19@gmail.com");
  const [phone, setPhone] = useState("9876543210");
  const [address, setAddress] = useState("Hyderabad, Telangana");

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Profile</Text>

        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={styles.editIcon}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* AVATAR + NAME */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name="account"
            size={50}
            color={COLORS.primary}
          />
        </View>

        {isEditing ? (
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
          />
        ) : (
          <Text style={styles.name}>{name}</Text>
        )}

        <View style={styles.badgeRow}>
          <View style={styles.roleBadge}>
            <Text style={styles.badgeText}>Donor</Text>
          </View>

          <View style={styles.verifiedBadge}>
            <MaterialCommunityIcons
              name="shield-check"
              size={16}
              color="#fff"
            />
            <Text style={styles.badgeText}> Verified</Text>
          </View>
        </View>
      </View>

      {/* STATS CARD */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Donations</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Impact Score</Text>
        </View>
      </View>

      {/* INFO CARDS */}
      <View style={styles.card}>
        <MaterialCommunityIcons name="email-outline" size={24} color={COLORS.primary} />
        {isEditing ? (
          <TextInput
            style={styles.cardTextInput}
            value={email}
            onChangeText={setEmail}
          />
        ) : (
          <Text style={styles.cardText}>{email}</Text>
        )}
      </View>

      <View style={styles.card}>
        <MaterialCommunityIcons name="phone-outline" size={24} color={COLORS.primary} />
        {isEditing ? (
          <TextInput
            style={styles.cardTextInput}
            value={phone}
            onChangeText={setPhone}
          />
        ) : (
          <Text style={styles.cardText}>{phone}</Text>
        )}
      </View>

      <View style={styles.card}>
        <MaterialCommunityIcons name="map-marker-outline" size={24} color={COLORS.primary} />
        {isEditing ? (
          <TextInput
            style={styles.cardTextInput}
            value={address}
            onChangeText={setAddress}
          />
        ) : (
          <Text style={styles.cardText}>{address}</Text>
        )}
      </View>

      {/* FILE A COMPLAINT */}
      <TouchableOpacity style={styles.actionCard}>
        <MaterialCommunityIcons name="alert-outline" size={24} color="#FF9800" />
        <Text style={styles.actionText}>File a Complaint</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>

      {/* HELP & SUPPORT */}
      <TouchableOpacity style={styles.actionCard}>
        <MaterialCommunityIcons name="help-circle-outline" size={24} color="#FF9800" />
        <Text style={styles.actionText}>Help & Support</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}

    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.peach,
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  profileSection: {
    alignItems: "center",
    marginTop: -40,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 15,
  },

  nameInput: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  badgeRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  roleBadge: {
    backgroundColor: "#ffe0b2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },

  verifiedBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  statsCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "700",
  },

  statLabel: {
    color: "#777",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 18,
    borderRadius: 15,
    elevation: 2,
  },

  cardText: {
    marginLeft: 15,
    fontSize: 16,
    flex: 1,
  },

  cardTextInput: {
    marginLeft: 15,
    fontSize: 16,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 18,
    borderRadius: 15,
    elevation: 2,
  },

  actionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },

  saveButton: {
    backgroundColor: COLORS.primary,
    margin: 20,
    padding: 18,
    borderRadius: 25,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
