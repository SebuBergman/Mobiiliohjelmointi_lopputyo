import React from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function Watchlist({ navigation, route }) {

  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists watchlist (id integer primary key not null, title text, poster text, release_date text);');
    }, null, updateWatchlist);
  }, []);

  const updateWatchlist = () => {
    db.transaction(tx => {
      tx.executeSql('select * from watchlist;', [], (_, { rows }) =>
        setWatchlist(rows._array)
      );
      console.log(watchlist);
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
      <View style={styles.searchResultsContainer}>
        {
          watchlist.map((item, i) => (
            <ListItem key={i} bottomDivider>
              <Avatar size={"large"} source={{uri: "https://image.tmdb.org/t/p/w500" + item.poster}} />
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
      </View>
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