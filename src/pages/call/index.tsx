import {StyleSheet, useColorScheme, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

import {ThemedText, ThemedView, Button} from '../../components';

import {Colors} from '../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

import {NavigationProp} from '@react-navigation/native';

export default function CallScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const [isModalVisible, setIsModalVisible] = useState(false);

  const usersData = [
    {initial: 'R', username: 'Rizki Alfan', id: '@5GH6X009'},
    {initial: 'R', username: 'Rizki Alfan', id: '@5GH6X009'},
    {initial: 'R', username: 'Rizki Alfan', id: '@5GH6X009'},
    {initial: 'R', username: 'Rizki Alfan', id: '@5GH6X009'},
  ];

  const openModalAddPerson = () => {
    setIsModalVisible(true);
  };

  const closeModalAddPerson = () => {
    setIsModalVisible(false);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === 'light'
            ? Colors.light.background
            : Colors.dark.background,
      }}>
      {/* <ThemedModal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeModalAddPerson}
        animationType="fade"
        style={{rowGap: 20}}>
        {usersData.map((user, index) => (
          <View style={{flexDirection: 'row', columnGap: 10}} key={index}>
            <View
              style={{
                borderRadius: 9999,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                  colorScheme === 'light'
                    ? Colors.light.tint
                    : Colors.dark.tint,
              }}>
              <ThemedText
                lightColor={Colors.light.background}
                darkColor={Colors.dark.background}>
                {user.initial}
              </ThemedText>
            </View>
            <View>
              <ThemedText>{user.username}</ThemedText>
              <ThemedText type="subtitle">{user.id}</ThemedText>
            </View>
          </View>
        ))}
      </ThemedModal> */}
      <ThemedView
        lightColor={Colors.light.background}
        darkColor={Colors.dark.background}
        style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              size={24}
              name="arrow-back"
              color={
                colorScheme === 'light' ? Colors.light.icon : Colors.dark.icon
              }
            />
          </TouchableOpacity>
          <ThemedText type="default">End-to-end encryted</ThemedText>
          <TouchableOpacity onPress={openModalAddPerson}>
            <Ionicons
              name="person-add"
              size={24}
              color={
                colorScheme === 'light' ? Colors.light.icon : Colors.dark.icon
              }
            />
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={{flex: 1, rowGap: 5}}>
          <ThemedView
            lightColor={Colors.light.secondary}
            darkColor={Colors.dark.secondary}
            style={{
              flex: 1,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ThemedText>Widagdo</ThemedText>
            <ThemedText type="subtitle">Ringing</ThemedText>
          </ThemedView>
          <ThemedView
            lightColor={Colors.light.secondary}
            darkColor={Colors.dark.secondary}
            style={{
              flex: 1,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ThemedText>Widagdo</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView
          style={styles.footerContainer}
          lightColor={Colors.light.secondary}
          darkColor={Colors.dark.secondary}>
          <TouchableOpacity>
            <ThemedView
              style={{borderRadius: 30, padding: 10}}
              lightColor={Colors.light.tint}
              darkColor={Colors.dark.tint}>
              <Ionicons
                size={24}
                name="camera-reverse"
                color={
                  colorScheme === 'light'
                    ? Colors.light.background
                    : Colors.dark.background
                }
              />
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity>
            <ThemedView
              style={{borderRadius: 30, padding: 10}}
              lightColor={Colors.light.tint}
              darkColor={Colors.dark.tint}>
              <Ionicons
                size={24}
                name="mic"
                color={
                  colorScheme === 'light'
                    ? Colors.light.background
                    : Colors.dark.background
                }
              />
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity>
            <ThemedView
              style={{borderRadius: 30, padding: 10}}
              lightColor={Colors.light.tint}
              darkColor={Colors.dark.tint}>
              <Ionicons
                size={24}
                name="videocam-off"
                color={
                  colorScheme === 'light'
                    ? Colors.light.background
                    : Colors.dark.background
                }
              />
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity>
            <ThemedView
              style={{borderRadius: 30, padding: 10}}
              lightColor="red"
              darkColor="red">
              <Ionicons
                size={24}
                name="call"
                color={
                  colorScheme === 'light'
                    ? Colors.light.background
                    : Colors.dark.background
                }
              />
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    rowGap: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 10,
    paddingVertical: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
});
