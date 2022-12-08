import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import SearchScreen from './src/components/search';
import HomeScreen from './src/components/mainpage';
import Watchlist from './src/components/watchlist';
import Ratings from './src/components/ratings';
import ProfileScreen from './src/components/profile';
import RateMovie from './src/components/ratemovie';
import About from './src/components/about';

const screenOptions = ({ route }) => ({
  headerShown: false,
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === 'Home') {
      iconName = 'md-home';
    } else if (route.name === 'Search') {
      iconName = 'md-search';
    } else if (route.name === 'Profile') {
      iconName = 'md-person-circle';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  }
});

const AuthStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const YouStack = createNativeStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false, headerStyle: {backgroundColor: '#fff'}}} />
  </HomeStack.Navigator>
);

const SearchStackScreen = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen name="SearchScreen" component={SearchScreen} options={{ title: 'Search', headerStyle: {backgroundColor: '#fff'}}}/>
    <SearchStack.Screen name="RateMovie" component={RateMovie} />
  </SearchStack.Navigator>
);

const YouPageStackScreen = () => (
  <YouStack.Navigator>
    <YouStack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'You', headerShown: false, headerStyle: {backgroundColor: '#fff'}}} />
    <HomeStack.Screen name="Watchlist" component={Watchlist} options={{ headerStyle: {backgroundColor: '#fff'}}}/>
    <HomeStack.Screen name="Ratings" component={Ratings} options={{ headerStyle: {backgroundColor: '#fff'}}}/>
    <HomeStack.Screen name="About" component={About} options={{ headerStyle: {backgroundColor: '#fff'}}}/>
  </YouStack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tabs.Navigator screenOptions={screenOptions}>
        <Tabs.Screen name="Home" component={HomeStackScreen} />
        <Tabs.Screen name="Search" component={SearchStackScreen} />
        <Tabs.Screen name="Profile" component={YouPageStackScreen} />
      </Tabs.Navigator>
      {/* 
      <AuthStack.Navigator>
        <AuthStack.Screen name="Watchlist" component={Watchlist} />
      </AuthStack.Navigator>
      */}
    </NavigationContainer>
    
  );
}