import {
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

const SignUp = ({navigation}: {navigation: NavigationProp<any>}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const [form, setForm] = useState({
    email: '',
    phone: '',
    password: '',
  });
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
          <ThemedText type="title">Sign Up</ThemedText>
          <ThemedText>
            Let’s sign up to your account and start your call
          </ThemedText>
          <FormField
            title="Email"
            value={form.email}
            placeholder="Enter your email"
            handleChangeText={e => setForm({...form, email: e})}
            keyboardType="email-address"
          />
          <FormField
            title="Phone"
            value={form.phone}
            placeholder="Enter your phone number"
            handleChangeText={e => setForm({...form, phone: e})}
            keyboardType="phone-pad"
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
          title="Sign Up"
          onPress={() => console.log('Sign In Button Pressed!')}
          style={{marginTop: 20}}
        />
        <ThemedView
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
            alignItems: 'center',
          }}>
          <ThemedText>Already have an account? </ThemedText>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <ThemedText
              lightColor={Colors.light.tint}
              darkColor={Colors.dark.tint}
              type="link">
              Sign In
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
