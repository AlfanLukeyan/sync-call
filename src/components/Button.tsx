import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ViewStyle,
} from 'react-native';
import {Colors} from '../constants/Colors';
import {ThemedText} from './ThemedText';

type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

export const Button: React.FC<ButtonProps> = ({title, onPress, style}) => {
  const theme = useColorScheme() ?? 'light';

  const backgroundColor =
    theme === 'light' ? Colors.light.tint : Colors.dark.tint;
  const textColor = theme === 'light' ? Colors.light.text : Colors.dark.text;

  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor}, style]}
      onPress={onPress}
      activeOpacity={0.7}>
      <ThemedText
        style={styles.text}
        type="title"
        lightColor={Colors.light.background}
        darkColor={Colors.dark.background}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
  },
});
