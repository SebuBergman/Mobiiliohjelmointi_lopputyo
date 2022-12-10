import React from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ScrollView, Alert, TextInput } from 'react-native';
import { ListItem, Button, Input } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function SearchScreen({ navigation }) {
  const [keyword, setKeyword] = useState();
  const [searchResults, setSearchResults] = useState([]);

  const saveMovie = (movieDetails) => {
    db.transaction(tx => {
    tx.executeSql(`Select * FROM watchlist WHERE title="${movieDetails.original_title}";`,
    [],
    (tx, results) => {
      if (results.rows.length == 0) {
        db.transaction(tx => {
          tx.executeSql('insert into watchlist (title, poster, release_date) values (?, ?, ?);',
          [movieDetails.original_title, movieDetails.poster_path, movieDetails.release_date]);
          Alert.alert('Added to watchlist');
        }, errorAlertSave, null);
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

  const errorAlertSave = () => {
    Alert.alert('Something went wrong saving');
  }
  
  const getMovie = () => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=7781089812bce5be2d5c7957b17b321a&language=en-US&query=${keyword}&page=1&include_adult=false`)
    .then(res => res.json())
    .then(data => {
      setSearchResults(data.results);
    })
    .catch(err => console.error(err));
  }

  //<Input placeholder="Input" onChangeText={text => setKeyword(text)} inputStyle={{color: 'white'}} color="white" containerStyle={{backgroundColor: 'white', borderWidth: 1,}} />
  /* 
  <TextInput
            style={styles.input}
            onChangeText={text => setKeyword(text)}
            placeholder="Search movie"
            placeholderTextColor="grey"
          />
  */

  return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Input placeholder="Search movies" onChangeText={text => setKeyword(text)} inputStyle={{color: 'white'}} color="white" leftIcon={{ type: 'ionicon', name: 'search-outline', color: '#fff' }} />
          <Button title="Search" type="outline" onPress={getMovie} ></Button>
        </View>
        <ScrollView style={styles.searchResultsContainer}>
          {
            searchResults.map((movieDetails, i) => (
              <ListItem key={i} bottomDivider containerStyle={{backgroundColor: '#191919'}}>
                <Image source={{uri: "https://image.tmdb.org/t/p/w500" + movieDetails.poster_path}} style={styles.moviePosterArt} />
                <ListItem.Content>
                  <ListItem.Title style={{ color: 'white'}}>{movieDetails.original_title}</ListItem.Title>
                  <ListItem.Subtitle style={{ color: 'white'}}>{movieDetails.release_date}</ListItem.Subtitle>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  searchContainer: {
    marginTop: 10,
    alignItems: "center",
    height: 110,
  },

  searchResultsContainer: {
    backgroundColor: '#191919',
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
    paddingTop: 10,
  },

  moviePosterArt: {
    width: 100,
    height: 150,
  },

  //Search Input styles
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: 330,
    backgroundColor: "white",
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