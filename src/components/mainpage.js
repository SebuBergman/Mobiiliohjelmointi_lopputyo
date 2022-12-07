import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image, ScrollView } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating } from 'react-native-elements';
import { useFocusEffect } from "@react-navigation/core";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function HomeScreen({ navigation }) {
  const [popularMovies, setPopularMovies] = useState([]);
  const [watchlistedMovies, setWatchlistedMovies] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction(tx => {
        tx.executeSql('create table if not exists watchlist (id integer primary key not null, title text, poster text, release_date text);');
      }, null, null);
      db.transaction(tx => {
        tx.executeSql('create table if not exists ratings (id integer primary key not null, title text, poster text, release_date text, rating integer);');
      }, null, null);
      db.transaction(tx => {
        tx.executeSql('create table if not exists profile (id integer primary key not null, profilename text, watchlisted integer, ratings integer);');
      }, null, null);
      console.log("Tables Created")

      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=7781089812bce5be2d5c7957b17b321a&language=en-US&page=1`)
        .then(res => res.json())
        .then(data => {
          setPopularMovies(data.results);
        })
        .catch(err => console.error(err));

        db.transaction(tx => {
          tx.executeSql('select * from watchlist;', [], (_, { rows }) =>
            setWatchlistedMovies(rows._array)
          );
          }, null, null);
    }, []));

  return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.heading}>Welcome to Pixel Ratings</Text>
          <View style={styles.popularContainer}>
            <Text style={styles.headingText}>Featured today:</Text>
            <View style={styles.centerScrllView}>
              <ScrollView style={styles.popularScrllViewContainer} horizontal={true}>
              {
                popularMovies.map((item, i) => (
                  <ListItem key={i} bottomDivider containerStyle={{backgroundColor: "#212121"}}>
                    <Image source={{uri: "https://image.tmdb.org/t/p/w500" + item.poster_path}} style={styles.moviePosterArt} />
                    <ListItem.Content>
                      <ListItem.Title style={{ color: 'white' }}>{item.original_title}</ListItem.Title>
                      <ListItem.Subtitle style={{ color: 'white' }}>{item.release_date}</ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                ))
              }
              </ScrollView>
          </View>
        </View>
      </View>
      <View style={styles.aboutApp}>
        <Button title="About App" type="outline" onPress={() => navigation.navigate('About')} ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
    textAlign: 'center',
  },

  normalText:  {
    color: 'white',
    fontSize: 15,
  },

  headingText: {
    color: 'white',
    fontSize: 20,
    paddingLeft: 10,
    color: "#f7c518",
    fontWeight: "bold",
  },

  welcomeContainer: {
    marginTop: 100,
  },

  heading: {
    color: 'white',
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    paddingLeft: 10,
  },

  popularContainer: {
    backgroundColor: "#212121",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingTop: 10,
    paddingBottom: 20,
  },

  centerScrllView: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  popularScrllViewContainer: {
    width: 340,
    backgroundColor: "#212121",
  },

  moviePosterArt: {
    width: 120,
    height: 175,
  },

  aboutApp: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    padding: 5,
  },
});