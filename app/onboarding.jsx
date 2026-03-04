import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  Image,
  Platform,
} from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../_constants/colors";

const { width, height } = Dimensions.get("window");

// ─── Real food-donation themed images (Unsplash, no auth required) ───────────
const slides = [
  {
    id: "1",
    // Volunteers packing food boxes / food distribution
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80",
    bgColor: "#1B4332",
    accentColor: "#52B788",
    chipBg: "rgba(82,183,136,0.18)",
    chipText: "#52B788",
    badge: "🌍  1/3 of all food produced goes to waste",
    title: "Reduce\nFood Waste",
    description:
      "Every day, tonnes of perfectly edible food are discarded while millions go hungry. Together we can close that gap.",
    btnColor: "#2D6A4F",
  },
  {
    id: "2",
    // Sharing / handing food
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    bgColor: "#7D2000",
    accentColor: "#FF8C55",
    chipBg: "rgba(255,140,85,0.18)",
    chipText: "#FF6B2B",
    badge: "🤝  800M people go to bed hungry every night",
    title: "Share With\nThose In Need",
    description:
      "Restaurants, hotels, caterers and households can donate surplus food to nearby NGOs and verified volunteers — in minutes.",
    btnColor: "#FF6B2B",
  },
  {
    id: "3",
    // Community / happy recipients
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
    bgColor: "#0D3349",
    accentColor: "#5BB8F5",
    chipBg: "rgba(91,184,245,0.18)",
    chipText: "#457B9D",
    badge: "🌱  Food waste causes 8% of global CO₂ emissions",
    title: "Build a Better\nCommunity",
    description:
      "Every meal shared strengthens your community, reduces carbon emissions, and creates a measurable social impact.",
    btnColor: "#457B9D",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Card slide-up animation per slide change
  const cardY = useRef(new Animated.Value(30)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const animateCardIn = () => {
    cardY.setValue(30);
    cardOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(cardY, { toValue: 0, duration: 380, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]).start();
  };

  // Animate on mount
  useState(() => {
    animateCardIn();
  });

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
    } else {
      // Last slide → go to welcome screen
      router.replace("/welcome");
    }
  };

  const handleSkip = () => router.replace("/welcome");

  const current = slides[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── FULL SCREEN IMAGE PAGER ── */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
          animateCardIn();
        }}
        renderItem={({ item, index }) => {
          // Parallax effect: image moves slower than the slide
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const imgTranslate = scrollX.interpolate({
            inputRange,
            outputRange: [-width * 0.25, 0, width * 0.25],
            extrapolate: "clamp",
          });

          return (
            <View style={[styles.slide, { backgroundColor: item.bgColor }]}>
              {/* Parallax image */}
              <Animated.Image
                source={{ uri: item.image }}
                style={[styles.image, { transform: [{ translateX: imgTranslate }] }]}
                resizeMode="cover"
              />

              {/* Dark gradient overlay so text is readable */}
              <View style={styles.imageOverlay} />

              {/* Top fade overlay for status bar area */}
              <View style={styles.topFade} />
            </View>
          );
        }}
      />

      {/* ── SKIP BUTTON (top right, always visible) ── */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.8}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* ── SLIDE COUNTER (top left) ── */}
      <View style={styles.slideCounter}>
        <Text style={styles.slideCounterText}>
          {currentIndex + 1}
          <Text style={styles.slideCounterTotal}> / {slides.length}</Text>
        </Text>
      </View>

      {/* ── BOTTOM CONTENT CARD (slides up on each transition) ── */}
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY: cardY }], opacity: cardOpacity },
        ]}
      >
        {/* Badge pill */}
        <View style={[styles.badge, { backgroundColor: current.chipBg }]}>
          <Text style={[styles.badgeText, { color: current.chipText }]}>{current.badge}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{current.title}</Text>

        {/* Description */}
        <Text style={styles.description}>{current.description}</Text>

        {/* ── CONTROLS ROW: dots + next button ── */}
        <View style={styles.controlsRow}>
          {/* Morphing pagination dots */}
          <View style={styles.dotsRow}>
            {slides.map((_, i) => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 26, 8],
                extrapolate: "clamp",
              });
              const dotOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });
              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      opacity: dotOpacity,
                      backgroundColor: current.accentColor,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Next / Get Started button */}
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: current.btnColor }]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>
              {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
            <Text style={styles.nextBtnArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const CARD_HEIGHT = height * 0.42;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  // ── Slide / Image ──────────────────────────────────────────────
  slide: {
    width,
    height,
    overflow: "hidden",
  },
  image: {
    width: width * 1.5,         // wider than screen for parallax room
    height: height * 0.62,      // top portion only
    position: "absolute",
    top: 0,
    left: -(width * 0.25),      // center the wider image
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.55,
    // Gradient-like fade using multiple overlapping semi-transparent views
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  // ── Skip & Counter overlays ────────────────────────────────────
  skipBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 44,
    right: 24,
    zIndex: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  skipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  slideCounter: {
    position: "absolute",
    top: Platform.OS === "ios" ? 58 : 46,
    left: 24,
    zIndex: 20,
  },
  slideCounterText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  slideCounterTotal: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.55)",
  },

  // ── Bottom Card ────────────────────────────────────────────────
  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: Platform.OS === "ios" ? 44 : 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 20,
    zIndex: 10,
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    marginBottom: 18,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textDark,
    lineHeight: 38,
    letterSpacing: -0.6,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: COLORS.grayText,
    lineHeight: 24,
    marginBottom: 28,
  },

  // ── Controls row ───────────────────────────────────────────────
  controlsRow: {
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 26,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  nextBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  nextBtnArrow: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 18,
    fontWeight: "700",
  },
});