import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons} from '@expo/vector-icons';
import SearchScreen from './src/components/search';
import HomeScreen from './src/components/mainpage';
import Watchlist from './src/components/watchlist';
import RateMovie from './src/components/ratemovie';

const screenOptions = ({ route }) => ({
  headerShown: false,
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === 'Home') {
      iconName = 'md-home';
    } else if (route.name === 'Search') {
      iconName = 'md-settings';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  }
});

const AuthStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}} />
    <HomeStack.Screen name="Watchlist" component={Watchlist} />
  </HomeStack.Navigator>
);

const SearchStackScreen = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen name="SearchScreen" component={SearchScreen} options={{ title: 'Search' }}/>
    <SearchStack.Screen name="RateMovie" component={RateMovie} />
  </SearchStack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tabs.Navigator screenOptions={screenOptions}>
        <Tabs.Screen name="Home" component={HomeStackScreen} />
        <Tabs.Screen name="Search" component={SearchStackScreen} />
      </Tabs.Navigator>
      {/* 
      <AuthStack.Navigator>
        <AuthStack.Screen name="Watchlist" component={Watchlist} />
      </AuthStack.Navigator>
      */}
    </NavigationContainer>
    
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});