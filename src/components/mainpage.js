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
          <Text style={styles.normalText}>Popular movies:</Text>
          <ScrollView style={styles.popularMoviesContainer} horizontal={true}>
          {
            popularMovies.map((item, i) => (
              <ListItem key={i} bottomDivider>
                <Image source={{uri: "https://image.tmdb.org/t/p/w500" + item.poster_path}} style={styles.moviePosterArt} />
                <ListItem.Content>
                  <ListItem.Title>{item.original_title}</ListItem.Title>
                  <ListItem.Subtitle>{item.release_date}</ListItem.Subtitle>
                  <View style={styles.buttonContainer}>
                  </View>
                </ListItem.Content>
              </ListItem>
            ))
          }
        </ScrollView>
        <View style={styles.watchlistContainer}>
          <View style={styles.fromyourwatchlist}>
          <Text style={styles.normalText}>From your Watchlist:</Text>
          <Button title="See all" type="outline" onPress={() => navigation.navigate('Watchlist')}></Button>
          </View>
          <ScrollView style={styles.watchlistedContainer} horizontal={true}>
            {
              watchlistedMovies.map((item, i) => (
                <ListItem key={i} bottomDivider>
                  <Image source={{uri: "https://image.tmdb.org/t/p/w500" + item.poster}} style={styles.moviePosterArt} />
                <ListItem.Content>
                  <ListItem.Title>{item.title}</ListItem.Title>
                  <ListItem.Subtitle>{item.release_date}</ListItem.Subtitle>
                  <View style={styles.buttonContainer}>
                    <Button title="Watched" type="outline" onPress={() => deleteWatchlistItem(item.id)}></Button>
                  </View>
                </ListItem.Content>
              </ListItem>
              ))
            }
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    textAlign: 'center',
  },

  welcomeContainer: {
    marginTop: 100,
  },
  
  watchlistContainer: {
    marginTop: 30,
    textAlign: 'center',
  },

  fromyourwatchlist: {
    flexDirection: 'row',
  },

  heading: {
    fontSize: 20,
    marginBottom: 20,
  },

  normalText: {
    fontSize: 19,
  },

  popularMoviesContainer: {
    width: 350,
  },

  watchlistedContainer: {
    width: 350,
  },

  moviePosterArt: {
    width: 120,
    height: 175,
  },
});