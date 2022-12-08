import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image, ScrollView } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating } from 'react-native-elements';
import { useFocusEffect } from "@react-navigation/core";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function Ratings({ navigation }) {
  const [movie, setMovie] = useState('');
  const [movieWithRating, setMovieWithRating] = useState('');
  const [ratingsList, setRatingsList] = useState([]);

  //Stars for rating
  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const starImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  //Rating PopUp consts
  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1,2,3,4,5]);

  useFocusEffect(
  React.useCallback(() => {
    db.transaction(tx => {
    tx.executeSql('select * from ratings;', [], (_, { rows }) =>
      setRatingsList(rows._array)
    );
  }, null, null);
  }, []));

  const updateRatingsList = () => {
  db.transaction(tx => {
    tx.executeSql('select * from ratings;', [], (_, { rows }) =>
      setRatingsList(rows._array)
    );
  }, null, null);
  }

  const deleteRatingItem = (id) => {
  db.transaction(tx => {
    tx.executeSql('delete from ratings where id = ?;', [id]);
  }, errorAlertDelete, updateRatingsList);
  }

  const errorAlertDelete = () => {
    Alert.alert('Something went wrong with deletion');
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.searchResultsContainer}>
        {
          ratingsList.map((item, i) => (
            <ListItem key={i} bottomDivider containerStyle={{backgroundColor: '#191919'}}>
              <Image source={{uri: "https://image.tmdb.org/t/p/w500" + item.poster}} style={styles.moviePosterArt} />
              <ListItem.Content>
                <ListItem.Title style={{ color: 'white'}}>{item.title}</ListItem.Title>
                <ListItem.Subtitle style={{ color: 'white'}}>{item.release_date}</ListItem.Subtitle>
                <ListItem.Subtitle style={{ color: 'white'}}><Image source={require('../assets/star_filled.png')}
                style={styles.tinyStarLogo} /> {item.rating}</ListItem.Subtitle>
                <View style={styles.buttonContainer}>
                  <Button title="Delete" type="outline" onPress={() => deleteRatingItem(item.id)}></Button>
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

  //Scrollview container
  searchResultsContainer: {
    backgroundColor: '#191919',
  },

  //Text Style for saveRating text
  textStylePopup: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

  //AddRating button container
  buttonContainer: {
    marginTop: 10,
  },

  ratingContainer: {
    marginTop: 50,
  },

  customRatingBarStyle: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 30,
  },
  starImgStyle: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },

  tinyStarLogo: {
    width: 14,
    height: 14,
  },

  moviePosterArt: {
    width: 150,
    height: 225,
  },
});