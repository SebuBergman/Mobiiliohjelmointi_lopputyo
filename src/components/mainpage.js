import React from "react";
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button} from 'react-native-elements';
import { useFocusEffect } from "@react-navigation/core";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function HomeScreen({ navigation }) {

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
    }, []));

  const DeleteTables = () => {
    db.transaction(tx => {
      tx.executeSql('DROP TABLE watchlist');
    }, null, null);
    db.transaction(tx => {
      tx.executeSql('DROP TABLE ratings');
    }, null, null);
    db.transaction(tx => {
      tx.executeSql('DROP TABLE profile');
    }, null, null);
  }

  return (
      <View style={styles.container}>
        <Text>Home screen</Text>
        <Text>More stuff added soon</Text>
        {/*<Button title="Drop tables" type="outline" onPress={() => DeleteTables()}></Button>*/}
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