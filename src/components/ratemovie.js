import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image, Alert } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function RateMovie({ navigation, route }) {
  const { movieDetails } = route.params;
  const [ratingsItem, setRatingsItem] = useState();

  const [ratingsList, setRatingsList] = useState([]);

  const [movie, setMovie] = useState('');
  const [movieWithRating, setMovieWithRating] = useState([]);
  const [emptyArray, setEmptyArray] = useState([]);
  
  //Stars for rating
  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const starImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  // Popup modalVisible
  const [modalVisible, setModalVisible] = useState(false);

  //Rating PopUp consts
  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1,2,3,4,5]);

  const rateMovie = () => {
  db.transaction(tx => {
    tx.executeSql(`Select * FROM ratings WHERE title="${movieDetails.original_title}";`,
    [],
    (tx, results) => {
      //console.log(results);
      console.log(results.rows.length);
      if (results.rows.length == 0) {
        db.transaction(tx => {
          tx.executeSql('insert into ratings (title, poster, release_date, rating) values (?, ?, ?, ?);',
            [movieDetails.original_title, movieDetails.poster_path, movieDetails.release_date, defaultRating]);
        }, errorAlertSave, AlertSave);

        navigation.goBack();
      } else {
        Alert.alert('Movie already rated');
      }
    });
  });
  }

  const errorAlertSave = () => {
  Alert.alert('Something went wrong saving');
  }

  const AlertSave = () => {
  Alert.alert('Rating saved');
  }

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
      <Image source={{uri: "https://image.tmdb.org/t/p/w500" + movieDetails.poster_path}} style={styles.moviePosterArt} />
      <View style={styles.textContainer}>
        <Text style={styles.movieTitleHeading}>{movieDetails.original_title}</Text>
        <Text style={styles.releaseDateText}>{movieDetails.release_date}</Text>
      </View>
      <View>
        <CustomRatingBar />
        <View style={styles.buttonContainer}>
          <Button onPress={rateMovie} title="Save Rating" />
        </View>
      </View>
    </View>
  )
  }

  return (
      <View style={styles.container}>
          <RatingPopup />
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
    width: 200,
    height: 300,
  },

  textContainer: {
    width: 200,
  },

  movieTitleHeading: {
    fontSize: 20,
  },

  releaseDateText: {
    fontSize: 15,
  },

  buttonContainer: {
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
});