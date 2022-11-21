import React from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image, ScrollView, Alert } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function SearchScreen({ navigation }) {
  const [keyword, setKeyword] = useState();
  const [searchResults, setSearchResults] = useState([]);
  /*const [movieForRating, setMovieForRating] = useState('')*/
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

  const saveMovie = (movieDetails) => {
    db.transaction(tx => {
    tx.executeSql(`Select * FROM watchlist WHERE title="${movieDetails.original_title}";`,
    [],
    (tx, results) => {
      //console.log(results);
      console.log(results.rows.length);
      if (results.rows.length == 0) {
        db.transaction(tx => {
          tx.executeSql('insert into watchlist (title, poster, release_date) values (?, ?, ?);',
          [movieDetails.original_title, movieDetails.poster_path, movieDetails.release_date]);
          Alert.alert('Added to watchlist');
        }, errorAlertSave, updateWatchlist);
      } else {
        Alert.alert('Movie already in watchlist');
      }
    });
  });
  }

  const rateMovie = (movieDetails) => {
    if (movieDetails != null) {
      navigation.navigate('RateMovie', {
                movieDetails,
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

  const Watchlisted = () => {
  Alert.alert('Added to watchlist');
  }
  
  const getMovie = () => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=7781089812bce5be2d5c7957b17b321a&language=en-US&query=${keyword}&page=1&include_adult=false`)
    .then(res => res.json())
    .then(data => {
      setSearchResults(data.results);
      //console.log(searchResults);
    })
    .catch(err => console.error(err));
  }

  return (
      <View>
        <View style={styles.searchContainer}>
          <Input placeholder="Input" onChangeText={text => setKeyword(text) } />
          <Button title="Search" type="outline" onPress={getMovie} ></Button>
        </View>
        <ScrollView style={styles.searchResultsContainer}>
          {
            searchResults.map((movieDetails, i) => (
              <ListItem key={i} bottomDivider>
                <Image source={{uri: "https://image.tmdb.org/t/p/w500" + movieDetails.poster_path}} style={styles.moviePosterArt} />
                <ListItem.Content>
                  <ListItem.Title>{movieDetails.original_title}</ListItem.Title>
                  <ListItem.Subtitle>{movieDetails.release_date}</ListItem.Subtitle>
                  <View style={styles.buttonContainer}>
                    <Button title="Add to Watchlist" type="outline" onPress={() => saveMovie(movieDetails)}></Button>
                    <Button title="Rate" type="outline" onPress={() => {rateMovie(movieDetails)}}></Button>
                    {/* <RatingPopup /> */}
                  </View>
                </ListItem.Content>
              </ListItem>
            ))
          } 
        </ScrollView>
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

  moviePosterArt: {
    width: 100,
    height: 150,
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