import React from "react";
import { StyleSheet, Text, View, Button } from 'react-native';

export default function ProfileScreen({ navigation, route }) {
  return (
      <View style={styles.container}>
        <Button onPress={() => navigation.push('Watchlist')} title="Watchlist" />
        <Button onPress={() => navigation.push('Ratings')} title="Ratings" />
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