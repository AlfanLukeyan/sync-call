import {
  StyleSheet,
  StatusBar,
  useColorScheme,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../constants/Colors';
import {Icons} from '../../constants/Icons';

import {ThemedView} from '../../components/ThemedView';
import {ThemedText} from '../../components/ThemedText';
import FormField from '../../components/FormField';
import {Button} from '../../components/Button';

import {NavigationProp} from '@react-navigation/native';

const SignIn = ({navigation}: {navigation: NavigationProp<any>}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleSignIn = () => {
    navigation.navigate('MainTabs');
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
      <StatusBar
        barStyle={colorScheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={
          colorScheme === 'light'
            ? Colors.light.background
            : Colors.dark.background
        }
      />
      <ScrollView
        style={{
          paddingVertical: 20,
          paddingHorizontal: 20,
          backgroundColor:
            colorScheme === 'light'
              ? Colors.light.background
              : Colors.dark.background,
        }}>
        <ThemedView style={{alignItems: 'center', marginBottom: 50}}>
          <Image
            source={
              colorScheme === 'light'
                ? Icons.light.syncCallLogo
                : Icons.dark.syncCallLogo
            }
            style={{width: 75, height: 75}}
          />
          <ThemedText type="title" style={{fontWeight: 'normal'}}>
            Sync Call
          </ThemedText>
          <ThemedText>Connect. Collaborate. Conquer</ThemedText>
        </ThemedView>
        <ThemedView style={{rowGap: 10}}>
          <ThemedText type="title">Sign In</ThemedText>
          <FormField
            title="Email"
            value={form.email}
            placeholder="Enter your email"
            handleChangeText={e => setForm({...form, email: e})}
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="Password"
            handleChangeText={e => setForm({...form, password: e})}
            secureTextEntry
          />
        </ThemedView>
        <Button
          title="Sign In"
          onPress={handleSignIn}
          style={{marginTop: 20}}
        />
        <ThemedView
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
            alignItems: 'center',
          }}>
          <ThemedText>Don't have an account? </ThemedText>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <ThemedText
              lightColor={Colors.light.tint}
              darkColor={Colors.dark.tint}
              type="link">
              Sign Up
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
