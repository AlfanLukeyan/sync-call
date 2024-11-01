import {
  View,
  Image,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  StyleSheet,
  StatusBar,
  useColorScheme,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../constants/Colors';
import {ThemedView} from '../../components/ThemedView';
import {Button} from '../../components/Button';
import FeatureItem from '../../components/onboarding/FeatureItem';

import {SafeAreaView} from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;

import {NavigationProp} from '@react-navigation/native';

const OnboardingScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  // Accept navigation prop
  const colorScheme = useColorScheme() ?? 'light';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const data = [
    {
      title: 'Lorem ipsum dolor sit amet, conse video',
      description:
        'Lorem ipsum dolor sit amet, conse ctetur adipi scing elit. Nibh convallis varius iaculis Lorem ipsum dolor sit amet, conse ctetur adipi scing elit. Nibh convallis varius iaculis',
    },
    {
      title: 'Second Item Title',
      description:
        'Lorem ipsum dolor sit amet, conse ctetur adipi scing elit. Nibh convallis varius iaculis Lorem ipsum dolor sit amet, conse ctetur adipi scing elit. Nibh convallis varius iaculis',
    },
    {
      title: 'Third Item Title',
      description:
        'Lorem ipsum dolor sit amet, conse ctetur adipi scing elit. Nibh convallis varius iaculis Lorem ipsum dolor sit amet, conse ctetur adipi scing elit. Nibh convallis varius iaculis',
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setScrollX(offsetX);

    const index = Math.floor(
      offsetX / event.nativeEvent.layoutMeasurement.width,
    );
    setCurrentIndex(index);
  };

  const indicatorWidth = 20;
  const translateX = (scrollX / windowWidth) * indicatorWidth;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === 'light' ? Colors.light.tint : Colors.dark.tint,
      }}>
      <StatusBar
        barStyle={colorScheme === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={
          colorScheme === 'light' ? Colors.light.tint : Colors.dark.tint
        }
      />
      <ThemedView
        lightColor={Colors.light.tint}
        darkColor={Colors.dark.tint}
        style={styles.container}>
        <Image
          source={require('../../assets/images/onboarding.png')}
          style={styles.imageContainer}
          resizeMode="contain"
        />

        <ThemedView
          lightColor={Colors.light.background}
          darkColor={Colors.dark.background}
          style={styles.contentContainer}>
          <ThemedView style={styles.childContentContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              onScroll={handleScroll}
              scrollEventThrottle={16} // Update scroll events more frequently
              showsHorizontalScrollIndicator={false}
              style={styles.scrollView}>
              {data.map((item, index) => (
                <FeatureItem
                  key={index}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </ScrollView>

            <ThemedView style={styles.buttonContainer}>
              <Button
                title="Sign Up"
                onPress={() => navigation.navigate('SignUp')}
              />
              <ThemedView style={styles.scrollBarContainer}>
                <ThemedView
                  style={[styles.scrollIndicator, {transform: [{translateX}]}]}
                  lightColor={Colors.light.tint}
                  darkColor={Colors.dark.tint}
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageContainer: {
    height: 329,
    width: 354,
  },
  contentContainer: {
    height: '50%',
    borderRadius: 30,
    paddingVertical: 50,
  },
  childContentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    justifyContent: 'space-between',
  },
  scrollBarContainer: {
    height: 4,
    width: 70,
    backgroundColor: 'white',
    borderRadius: 30,
    marginLeft: 10,
    overflow: 'hidden',
  },
  scrollIndicator: {
    height: 4,
    width: 30,
    borderRadius: 30,
  },
});

export default OnboardingScreen;
