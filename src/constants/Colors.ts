/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#463CFF";
const tintColorDark = "#CDFE05";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    secondary: "#EEF2FE",
    icon: "#463CFF",
    tabIconDefault: "#463CFF",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#000",
    tint: tintColorDark,
    secondary: "#2D330F",
    icon: "#CDFE05",
    tabIconDefault: "#CDFE05",
    tabIconSelected: tintColorDark,
  },
};
