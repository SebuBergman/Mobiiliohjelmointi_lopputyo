import React from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image, ScrollView } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating } from 'react-native-elements';
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
    <View>
      <ScrollView style={styles.searchResultsContainer}>
        {
          watchlist.map((item, i) => (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  moviePosterArt: {
    width: 100,
    height: 150,
  },
});