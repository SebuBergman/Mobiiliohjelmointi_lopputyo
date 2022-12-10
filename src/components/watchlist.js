import React from "react";
import { useState } from 'react';
import { StyleSheet, View, Image, ScrollView, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { useFocusEffect } from "@react-navigation/core";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function Watchlist({ navigation, route }) {
  const [watchlist, setWatchlist] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction(tx => {
      tx.executeSql('select * from watchlist;', [], (_, { rows }) =>
        setWatchlist(rows._array)
      );
      }, null, null);
    }, []));

  const updateWatchlist = () => {
    db.transaction(tx => {
      tx.executeSql('select * from watchlist;', [], (_, { rows }) =>
        setWatchlist(rows._array)
      );
    }, null, null);
  }

  const deleteWatchlistItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from watchlist where id = ?;', [id]);
    }, errorAlertDelete, updateWatchlist);
  }

  const errorAlertDelete = () => {
    Alert.alert('Something went wrong with deletion');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Watchlist</Text>
      <ScrollView>
        {
          watchlist.map((item, i) => (
            <ListItem key={i} bottomDivider containerStyle={{backgroundColor: '#191919'}}>
              <Image source={{uri: "https://image.tmdb.org/t/p/w500" + item.poster}} style={styles.moviePosterArt} />
              <ListItem.Content>
                <ListItem.Title style={{ color: 'white'}}>{item.title}</ListItem.Title>
                <ListItem.Subtitle style={{ color: 'white'}}>{item.release_date}</ListItem.Subtitle>
                <View style={styles.buttonContainer}>
                  <Button title="Watched" type="outline" onPress={() => deleteWatchlistItem(item.id)}></Button>
                </View>
              </ListItem.Content>
            </ListItem>
          ))
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },

  //Font Style
  headingText: {
    color: 'white',
    fontSize: 30,
    paddingLeft: 15,
    paddingTop: 10,
    color: "#fff",
    fontWeight: "bold",
  },

  moviePosterArt: {
    width: 150,
    height: 225,
  },

  buttonContainer: {
    paddingTop: 10,
  },
});