import React from "react";
import { StyleSheet, Text, View, Button } from 'react-native';
import { NativeBaseProvider, Box, Center } from "native-base";


export default function Watchlist({ navigation }) {
  return (
    <NativeBaseProvider>
      <Center>
        <Center bg="primary.400" _text={{
        color: "white",
        fontWeight: "bold"
      }} height={200} width={{
        base: 200,
        lg: 250
      }}>
          This is the watchlist
        </Center>
      </Center>
    </NativeBaseProvider>
    
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