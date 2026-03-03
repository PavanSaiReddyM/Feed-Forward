// export const COLORS = {
//   primary: "#FF7A00",
//   darkOrange: "#E65100",
//   lightOrange: "#FF9800",
//   peach: "#FFF3E0",
//   cream: "#FFF8F1",
//   white: "#FFFFFF",
//   textDark: "#333333",
//   grayText: "#777777",

//   // Gradient colors
//   gradientStart: "#FF6B35",
//   gradientMid: "#FF8C42",
//   gradientEnd: "#FFB347",

//   // Status colors
//   success: "#4CAF50",
//   successLight: "#E8F5E9",
//   warning: "#FFA726",
//   warningLight: "#FFF3E0",
//   pending: "#FF9800",
//   pendingLight: "#FFE0B2",

//   // Accent colors
//   accentBlue: "#2196F3",
//   accentPurple: "#9C27B0",
//   shadow: "rgba(0, 0, 0, 0.1)",
//   shadowDark: "rgba(0, 0, 0, 0.2)",
// };

export const COLORS = {
  // Primary
  primary: "#FF6B2B",
  primaryDark: "#C44B0D",
  primaryLight: "#FF8F5E",
  primaryGlow: "rgba(255, 107, 43, 0.18)",

  // Success / Eco
  success: "#2D6A4F",
  successLight: "#D8F3DC",
  successMid: "#74C69D",

  // Backgrounds
  bg: "#FFF8F0",
  bgDeep: "#FFF0E0",
  card: "#FFFFFF",
  peach: "#FFE8D6",
  peachDark: "#FFD5B8",

  // Text
  textDark: "#1A1A2E",
  textMid: "#3D3D55",
  grayText: "#8D8D99",
  placeholder: "#BBBBC8",

  // Accent
  accentBlue: "#457B9D",
  accentBlueLight: "#D6EAF8",
  accentPurple: "#6B46C1",

  // Status
  warning: "#F4A261",
  warningLight: "#FFF0DC",
  pending: "#F4A261",
  pendingLight: "#FFF0DC",

  error: "#E63946",
  errorLight: "#FFEBEC",

  // Utility
  white: "#FFFFFF",
  black: "#000000",
  border: "rgba(0,0,0,0.07)",
  shadow: "rgba(255, 107, 43, 0.12)",
  shadowDark: "rgba(0,0,0,0.15)",
  overlay: "rgba(26,26,46,0.55)",

  // Admin
  adminDark: "#1A1A2E",
  adminMid: "#2D2D4E",
};

export const FONTS = {
  // Use expo-font to load these or fallback to system
  display: "System", // Replace with 'ClashDisplay-Bold' after installing
  body: "System",    // Replace with 'DMSans-Regular' after installing
  mono: "System",    // Replace with 'DMSans-Medium' after installing
};

export const SHADOW = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 20,
    elevation: 8,
  },
  primary: {
    shadowColor: "#FF6B2B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};