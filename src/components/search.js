import React from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function SearchScreen({ navigation }) {
  const [keyword, setKeyword] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [movieForRating, setMovieForRating] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [ratingsList, setRatingsList] = useState([]);

  //Stars for rating
  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const starImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  // Popup modalVisible
  const [modalVisible, setModalVisible] = useState(false);

  //Rating PopUp consts
  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1,2,3,4,5]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists watchlist (id integer primary key not null, title text, poster text, release_date text);');
    }, null, updateWatchlist);
    db.transaction(tx => {
      tx.executeSql('create table if not exists ratings (id integer primary key not null, title text, poster text, release_date text, rating);');
    }, null, null);
  }, []);

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
        <View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <Pressable style={styles.outsideModal}
              onPress={(event) => { if (event.target == event.currentTarget) { 
              setModalVisible(false); } }} >

              {/* Add a new rating*/}
              <View style={styles.modal}>
                  <View style={styles.modalHeader}>
                      <View style={styles.modalHeaderContent}>
                        <Text>Add players</Text>
                      </View>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                          <Text style={styles.modalHeaderCloseText}>X</Text>
                      </TouchableOpacity>
                  </View>
              <View style={styles.modalContent}>
              {/*<View style={styles.ratingsContainer}>*/}
                <CustomRatingBar />
                <Pressable
                  style={[styles.buttonpopup, styles.buttonClose]}
                  onPress={rateMovie} >
                <Text style={styles.textStyle}>Save player</Text>
                </Pressable>
              </View>
            </View>
            </Pressable>
          </Modal>
        </View>
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

  const saveMovie = (item) => {
    db.transaction(tx => {
      tx.executeSql('insert into watchlist (title, poster, release_date) values (?, ?, ?);',
        [item.original_title, item.poster_path, item.release_date]);
    }, errorAlertSave, updateWatchlist);
  }

  const rateMovie = (item) => {
    console.log(item);

    /*db.transaction(tx => {
      tx.executeSql('insert into ratings (title, poster, release_date, rating) values (?, ?, ?, ?);',
        [item.original_title, item.poster_path, item.release_date, movieWithRating.rating]);
    }, errorAlertSave, updateRatingsList);*/
    //setModalVisible(!modalVisible);
    setMovieForRating(item);

    if (movieForRating != null) {
      navigation.navigate('RateMovie', {
                movieForRating,
            });
    } else {
      alert('Please choose a movie to rate!');
    }
  }

  const updateWatchlist = () => {
    db.transaction(tx => {
      tx.executeSql('select * from watchlist;', [], (_, { rows }) =>
        setWatchlist(rows._array)
      );
      console.log(watchlist);
    }, null, null);
  }

  const updateRatingsList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from ratings;', [], (_, { rows }) =>
        setRatingsList(rows._array)
      );
    }, null, null);
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
                <Avatar size={"large"} source={{uri: "https://image.tmdb.org/t/p/w500" + item.poster_path}} />
                <ListItem.Content>
                  <ListItem.Title>{item.original_title}</ListItem.Title>
                  <ListItem.Subtitle>{item.release_date}</ListItem.Subtitle>
                  <View style={styles.buttonContainer}>
                    <Button title="Add to watchlist" type="outline" onPress={() => saveMovie(item)}></Button>
                    <Button title="Rate Movie" type="outline" onPress={() => rateMovie(item)}></Button>
                    {/* <RatingPopup /> */}
                  </View>
                </ListItem.Content>
              </ListItem>
            ))
          }
        </View>
      </View>
  );

  //<Button title="Rate Movie" onPress={rateMovie} />
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

  /*
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
  },*/

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

  ratingsContainer: {
    marginBottom: 10,
  },

  //Modal popup for ratings
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 40,
    },

    addPlayers: {
      fontSize: 18,
      borderBottomWidth: 1.0,
      borderColor: "#0055b3",
      marginBottom: 5,
      color: 'black',
    },

    modalView: {
      alignItems: "center",
      justifyContent: "center",
    },
    modal: {
      height: 200,
      margin: 50,
      padding: 5,
      backgroundColor: "white",
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    /* The content of the modal takes all the vertical space not used by the header. */
    modalContent: {
      flex: 1,
      borderWidth: 1,
      borderColor: "black",
      padding: 15,
    },
    modalHeader: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: "black"
    },
    /* The header takes up all the vertical space not used by the close button. */
    modalHeaderContent: {
      flexGrow: 1,
      marginLeft: 5,
    },
    modalHeaderCloseText: {
      textAlign: "center",
      paddingLeft: 5,
      paddingRight: 5
    },
    outsideModal: {
      backgroundColor: "rgba(1, 1, 1, 0.2)",
      flex: 1,
    },
});