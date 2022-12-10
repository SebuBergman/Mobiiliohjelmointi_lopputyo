import React from "react";
import { StyleSheet, View, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';

export default function About({ navigation }) {

    return (
        <View style={styles.container}>
            <Text style={styles.headingText}>About app</Text>
            <Text style={styles.normalText}>This app is the result of a Mobile Programming (Mobiiliohjelmointi) course at Haaga-Helia University of Applied Sciences.</Text>
            <Text></Text>
            <Text style={styles.normalText}>This application uses data from The Movie Database API</Text>
            <View style={styles.movieDatabaseLogo}>
              <Image source={require("../assets/MovieDBImage.png")}  />
            </View>
            <Text></Text>
            <Text style={styles.normalText}>All data provided by the API is available under the Creative Commons Attribution-ShareAlike 4.0 International License.</Text>
            <Button
                title='Back'
                titleStyle={{ fontWeight: '700' }}
                onPress={() => navigation.goBack()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    alignItems: 'center',
    justifyContent: 'center',
  },

  //Text Styles
  headingText: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingBottom: 10,
  },

  normalText: {
    color: 'white',
    fontSize: 20,
  },

  movieDatabaseLogo: {
    padding: 10,
  },
});