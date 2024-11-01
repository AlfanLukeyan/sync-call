// FeatureItem.tsx
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {ThemedText} from '../ThemedText';

const windowWidth = Dimensions.get('window').width;

type FeatureItemProps = {
  title: string;
  description: string;
};

const FeatureItem = ({title, description}: FeatureItemProps) => {
  return (
    <View style={styles.scrollItem}>
      <ThemedText type="title" style={{marginVertical: 10}}>
        {title}
      </ThemedText>
      <ThemedText>{description}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollItem: {
    width: windowWidth,
    paddingHorizontal: 30,
  },
});

export default FeatureItem;
