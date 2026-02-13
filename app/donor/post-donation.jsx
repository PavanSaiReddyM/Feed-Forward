import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../_constants/colors";

export default function PostDonation() {
  const [foodName, setFoodName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [location, setLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [imageUri, setImageUri] = useState(null);

  const handleSubmit = () => {
    console.log("Donation submitted");
  };
  const Input = ({ label, value, setValue, keyboardType, multiline }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 80 }]}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#999"
        value={value}
        onChangeText={setValue}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Post Food Donation</Text>
        <Text style={styles.headerSubtitle}>
          Share surplus food & reduce waste
        </Text>
      </View>

      {/* FORM CARD */}
      <View style={styles.card}>

        {/* IMAGE UPLOAD */}
        <TouchableOpacity style={styles.imageUpload}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="camera-plus"
                size={40}
                color={COLORS.primary}
              />
              <Text style={styles.uploadText}>
                Upload Food Image
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* INPUTS */}
        <Input label="Food Name" value={foodName} setValue={setFoodName} />
        <Input label="Food Type" value={foodType} setValue={setFoodType} />
        <Input
          label="Quantity (kg)"
          value={quantity}
          setValue={setQuantity}
          keyboardType="numeric"
        />
        <Input label="Expiry Time" value={expiryTime} setValue={setExpiryTime} />
        <Input
          label="Pickup Location"
          value={location}
          setValue={setLocation}
          multiline
        />
        <Input
          label="Preferred Pickup Time"
          value={pickupTime}
          setValue={setPickupTime}
        />

        {/* SUBMIT BUTTON */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            Submit Donation
          </Text>
        </TouchableOpacity>

      </View>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },

  headerSubtitle: {
    color: "#fff",
    marginTop: 6,
    opacity: 0.9,
  },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 4,
  },

  imageUpload: {
    height: 180,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.lightOrange,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "#fff8f2",
  },

  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },

  uploadText: {
    marginTop: 10,
    color: COLORS.primary,
    fontWeight: "600",
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.darkOrange,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    padding: 15,
    borderRadius: 14,
    fontSize: 15,
  },

  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
