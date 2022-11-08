import React from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function SearchScreen({ navigation }) {
  const [keyword, setKeyword] = useState('Star Wars');
  const [searchResults, setSearchResults] = useState([]);
  const [movie, setMovie] = useState('');
  const [movieWithRating, setMovieWithRating] = useState('');

  //Stars for rating
  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const starImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  // Popup modalVisible
  const [modalVisible, setModalVisible] = useState(false);

  //Rating PopUp consts
  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1,2,3,4,5]);

  const CustomRatingBar = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {
          maxRating.map((item, key) => {
            return (
              <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setDefaultRating(item)}
              >
                <Image 
                style={styles.starImgStyle}
                source={item <= defaultRating ? {uri: starImgFilled} : {uri: starImgCorner}}
                />

              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }

  const RatingPopup = () => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
        {/* Add a rating */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <CustomRatingBar />
            <Pressable
              style={[styles.buttonpopup, styles.buttonClose]}
              //onPress={rateMovie}
              >
              <Text style={styles.textStyle}>Save rating</Text>
          </Pressable>
          </View>
        </View>
        </Modal>
        <View style={styles.addRatingButtonContainer}>
          <Pressable
              title="Add Rating"
              style={[styles.buttonpopup, styles.buttonOpen]}
              onPress={() => setModalVisible(true)} >
            <Text style={styles.textStylePopup}>Add rating</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  useEffect(() => {
      getMovie();
    db.transaction(tx => {
      tx.executeSql('create table if not exists watchlist (id integer primary key not null, title text, poster text, release_date text);');
    }, null, updateWatchlist);
    db.transaction(tx => {
      tx.executeSql('create table if not exists ratings (id integer primary key not null, title text, poster text, release_date text, rating);');
    }, null, updateRatingsList);
  }, []);

  const saveMovie = (item) => {
    //setMovie(item.original_title);
    //console.log("movie saved?");
    console.log(item);

    db.transaction(tx => {
      tx.executeSql('insert into watchlist (title, poster, release_date) values (?, ?, ?);',
        [item.original_title, item.poster_path, item.release_date]);
    }, errorAlertSave, updateWatchlist);
  }

  const rateMovie = (item) => {
    console.log(item);

    db.transaction(tx => {
      tx.executeSql('insert into ratings (title, poster, release_date, rating) values (?, ?, ?, ?);',
        [item.original_title, item.poster_path, item.release_date, movieWithRating.rating]);
    }, errorAlertSave, updateRatingsList);
  }

  const updateWatchlist = () => {
    db.transaction(tx => {
      tx.executeSql('select * from watchlist;', [], (_, { rows }) =>
        setItemList(rows._array)
      );
    }, null, null);
  }

  const updateRatingsList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from ratings;', [], (_, { rows }) =>
        setItemList(rows._array)
      );
    }, null, null);
  }

  const deleteItemsWatchlist = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from watchlist where id = ?;', [id]);
    }, errorAlertDelete, updateWatchlist);
  }

  const errorAlertDelete = () => {
    Alert.alert('Something went wrong with deletion');
  }

  const errorAlertSave = () => {
    Alert.alert('Something went wrong saving');
  }
  
  const getMovie = () => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=7781089812bce5be2d5c7957b17b321a&language=en-US&query=${keyword}&page=1&include_adult=false`)
    .then(res => res.json())
    .then(data => {
      setSearchResults(data.results);
      console.log(searchResults);
    })
    .catch(err => console.error(err));
  }

  return (
      <View>
        <View style={styles.searchContainer}>
          <Input placeholder="Input" onChangeText={text => setKeyword(text) } />
          <Button title="Search" type="outline" onPress={getMovie} ></Button>
        </View>
        <View style={styles.searchResultsContainer}>
          {
            searchResults.map((item, i) => (
              <ListItem key={i} bottomDivider>
                <Avatar source={{uri: "https://image.tmdb.org/t/p/w500" + item.poster_path}} />
                <ListItem.Content>
                  <ListItem.Title>{item.original_title}</ListItem.Title>
                  <ListItem.Subtitle>{item.release_date}</ListItem.Subtitle>
                  <View style={styles.buttonContainer}>
                    <Button title="Add to watchlist" type="outline" onPress={() => saveMovie(item)}></Button>
                    <Button title="Rate Movie" onPress={() => navigation.push('RateMovie', item)} />
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
  searchContainer: {
    marginTop: 10,
    alignItems: "center",
    height: 110,
  },
  searchResultsContainer: {
    marginTop: 10,
    height: 200,
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
  buttonContainer: {
    justifyContent: "center",
    flexDirection: "row",
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
  addRatingButtonContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
});