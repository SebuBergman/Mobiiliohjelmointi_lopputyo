import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image } from 'react-native';
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

    // Popup modalVisible
    const [modalVisible, setModalVisible] = useState(false);

    //Rating PopUp consts
    const [defaultRating, setDefaultRating] = useState(2);
    const [maxRating, setMaxRating] = useState([1,2,3,4,5]);

    useFocusEffect(
    React.useCallback(() => {
      db.transaction(tx => {
      tx.executeSql('create table if not exists ratings (id integer primary key not null, title text, poster text, release_date text, rating integer);');
    }, null, updateRatingsList);
    }, []));

    const updateRatingsList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from ratings;', [], (_, { rows }) =>
        setRatingsList(rows._array)
      );
    }, null, null);
    console.log(ratingsList);
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
    <View>
      <View style={styles.searchResultsContainer}>
        {
          ratingsList.map((item, i) => (
            <ListItem key={i} bottomDivider>
              <Image source={{uri: "https://image.tmdb.org/t/p/w500" + item.poster}} style={styles.moviePosterArt} />
              <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
                <ListItem.Subtitle>{item.release_date}</ListItem.Subtitle>
                <ListItem.Subtitle><Image source={require('../assets/star_filled.png')}
                style={styles.tinyStarLogo} /> {item.rating}</ListItem.Subtitle>
                <View style={styles.buttonContainer}>
                  <Button title="Delete Rating" type="outline" onPress={() => deleteRatingItem(item.id)}></Button>
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

  //PopUp Styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  //Button Styles (addRating & saveRating)
  buttonpopup: {
    borderRadius: 20,
    padding: 12,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#2196F3",
    borderColor: 'transparent',
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },

  //Text Style for saveRating text
  textStylePopup: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

  //AddRating button container
  buttonContainer: {
    marginTop: 5,
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
    width: 100,
    height: 150,
  },
});