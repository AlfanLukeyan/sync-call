import {View, Text, useColorScheme} from 'react-native';
import React from 'react';

import {Colors} from '../../../constants/Colors';

const NotificationScreen = () => {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View style={{flex: 1, backgroundColor: Colors[colorScheme].background}}>
      <Text>NotificationScreen</Text>
    </View>
  );
};

export default NotificationScreen;
