import React from "react";
import { StyleSheet, Text, View, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
      <View style={styles.container}>
      <Text>Home screen</Text><Button onPress={() => navigation.push('Watchlist')} title="Watchlist" />
      </View>
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