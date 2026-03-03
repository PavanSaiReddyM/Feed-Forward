
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
} from "react-native";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../_constants/colors";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    emoji: "🌾",
    bg: "#2D6A4F",
    accent: "#74C69D",
    overlayColor: "rgba(45,106,79,0.82)",
    title: "Reduce\nFood Waste",
    description:
      "Every day, tonnes of perfectly good food are thrown away. Together, we can change that — one meal at a time.",
    stat: "1/3 of all food produced globally goes to waste",
  },
  {
    id: "2",
    emoji: "🤝",
    bg: "#FF6B2B",
    accent: "#FFD5B8",
    overlayColor: "rgba(196,75,13,0.80)",
    title: "Share With\nThose In Need",
    description:
      "Restaurants, hotels, and households can donate surplus food to NGOs and volunteers in minutes.",
    stat: "800M people go to bed hungry every night",
  },
  {
    id: "3",
    emoji: "🌍",
    bg: "#457B9D",
    accent: "#D6EAF8",
    overlayColor: "rgba(35,87,137,0.82)",
    title: "Make The\nPlanet Better",
    description:
      "Reducing food waste cuts CO₂ emissions. Your actions today create a healthier planet for tomorrow.",
    stat: "8% of global emissions come from food waste",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const handleNext = () => {
    contentAnim.setValue(0);
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.replace("/login");
    }
  };

  const handleSkip = () => router.replace("/login");

  const renderSlide = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.bg }]}>
      {/* Decorative circles */}
      <View style={[styles.deco1, { backgroundColor: item.accent, opacity: 0.18 }]} />
      <View style={[styles.deco2, { backgroundColor: item.accent, opacity: 0.1 }]} />

      {/* Big emoji illustration */}
      <View style={styles.emojiWrap}>
        <View style={[styles.emojiCircle, { backgroundColor: item.accent, opacity: 0.22 }]} />
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>

      {/* Content card */}
      <View style={styles.card}>
        {/* Stat pill */}
        <View style={[styles.statPill, { backgroundColor: item.bg + "15" }]}>
          <View style={[styles.statDot, { backgroundColor: item.bg }]} />
          <Text style={[styles.statText, { color: item.bg }]} numberOfLines={2}>{item.stat}</Text>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Bottom controls */}
      <View style={styles.controls}>
        {/* Morphing dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: "clamp",
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.35, 1, 0.35],
              extrapolate: "clamp",
            });
            const dotColor = slides[currentIndex].bg;
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: dotColor,
                  },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: slides[currentIndex].bg }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? "Get Started →" : "Next →"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  skipBtn: {
    position: "absolute",
    top: 56,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  skipText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 200,
  },
  deco1: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    top: -100,
    right: -100,
  },
  deco2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    bottom: 160,
    left: -80,
  },
  emojiWrap: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  emojiCircle: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  emoji: {
    fontSize: 80,
  },
  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 32,
    paddingBottom: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 12,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    marginBottom: 16,
    gap: 8,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  statText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.textDark,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: COLORS.grayText,
    lineHeight: 24,
  },
  controls: {
    position: "absolute",
    bottom: 48,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  nextText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});