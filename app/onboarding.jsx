import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../_constants/colors"; // adjust if needed

import slide1 from "./images/slide1.jpg";
import slide2 from "./images/slide2.jpg";
import slide3 from "./images/slide3.jpg";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: "1",
      image: slide1,
      title: "Reduce Food Waste",
      description:
        "Connect restaurants and NGOs to share surplus food easily.",
    },
    {
      id: "2",
      image: slide2,
      title: "Share With Those In Need",
      description:
        "Donate excess food and make a real social impact.",
    },
    {
      id: "3",
      image: slide3,
      title: "Make The Planet Better",
      description:
        "Together we can reduce hunger and food wastage.",
    },
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      router.replace("/login");
    }
  };

  const handleSkip = () => {
    router.replace("/login");
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      {/* IMAGE */}
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="cover"
      />

      {/* CONTENT */}
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>
          {item.description}
        </Text>

        {/* Pagination */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          {currentIndex !== slides.length - 1 && (
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextText}>
              {currentIndex === slides.length - 1
                ? "Get Started"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={slides}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(
          event.nativeEvent.contentOffset.x / width
        );
        setCurrentIndex(index);
      }}
    />
  );
}
const styles = StyleSheet.create({
  slide: {
    width: width,
    flex: 1,
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: "65%",
  },

  bottomContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#E65100",
    textAlign: "center",
  },

  description: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    marginVertical: 15,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },

  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
    marginHorizontal: 5,
  },

  activeDot: {
    backgroundColor: "#FF7A00",
    width: 18,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  skipText: {
    color: "#777",
    fontSize: 16,
  },

  nextButton: {
    backgroundColor: "#FF7A00",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  nextText: {
    color: "#fff",
    fontWeight: "600",
  },
});
