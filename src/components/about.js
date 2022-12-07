import React from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image, ScrollView } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating } from 'react-native-elements';
import { useFocusEffect } from "@react-navigation/core";

export default function About({ navigation, route }) {

    return (
        <View style={styles.container}>
            <Text style={styles.headingText}>About</Text>
            <Text style={styles.normalText}>This app is the work of the Mobile Programming (Mobiiliohjelmointi) course at Haaga-Helia University of Applied Sciences.</Text>
            <Text></Text>
            <Text style={styles.normalText}>This application uses data from The Movie Database API</Text>
            <Image source={{uri: require('../assets/TheMovieDB.svg')}} style={styles.movieDatabaseLogo} />
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
    fontSize: 25,
    fontWeight: "bold",
    paddingLeft: 10,
  },

  normalText: {
    color: 'white',
    fontSize: 20,
  },

  movieDatabaseLogo: {
    width: 100,
    height: 100,
  },
});