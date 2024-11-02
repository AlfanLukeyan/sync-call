import React, {useEffect, useReducer} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  OnboardingScreen,
  SignIn,
  SignUp,
  HomeScreen,
  NotificationScreen,
} from './pages';
import {View, Text} from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Initial state for authentication management
const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
};

// Reducer to manage different app states
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
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        userToken: null,
      };
    default:
      return state;
  }
}

function MainTabs() {
  return (
    <Tab.Navigator>
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

function App(): React.JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Simulate token loading delay with setTimeout
    const bootstrapAsync = () => {
      setTimeout(() => {
        // Use dummy data to simulate a retrieved token
        const userToken = 'dummy-auth-token';

        // Dispatch token restoration action
        dispatch({type: 'RESTORE_TOKEN', token: userToken});
      }, 1000); // Simulated 1-second delay
    };

    bootstrapAsync();
  }, []);

  if (state.isLoading) {
    // While loading, just return null to indicate a loading state without UI
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {state.userToken == null ? (
          // User is not signed in
          <>
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
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{headerShown: false}}
            />
          </>
        ) : (
          // User is signed in
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
