import React, {useEffect, useReducer} from 'react';
import {View, Text, useColorScheme} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Colors} from './constants/Colors';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  OnboardingScreen,
  SignIn,
  SignUp,
  HomeScreen,
  NotificationScreen,
  CallScreen,
} from './pages';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
};

type State = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
};

type Action =
  | {type: 'RESTORE_TOKEN'; token: string}
  | {type: 'SIGN_IN'; token: string}
  | {type: 'SIGN_OUT'};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {...state, userToken: action.token, isLoading: false};
    case 'SIGN_IN':
      return {...state, isSignout: false, userToken: action.token};
    case 'SIGN_OUT':
      return {...state, isSignout: true, userToken: null};
    default:
      return state;
  }
}

function HomeStack() {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Notifications') {
            iconName = 'notifications';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
          borderTopWidth: 0,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{
          headerShown: false,
          title: 'Sign in',
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function App(): React.JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const bootstrapAsync = () => {
      setTimeout(() => {
        const userToken = 'dummy-auth-token';
        dispatch({type: 'RESTORE_TOKEN', token: userToken});
      }, 1000);
    };

    bootstrapAsync();
  }, []);

  if (state.isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {state.userToken == null ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="Main" component={HomeStack} />
            <Stack.Screen name="Call" component={CallScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
