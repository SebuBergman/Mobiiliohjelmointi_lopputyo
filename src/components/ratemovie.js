import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function RateMovie({ navigation, route }) {
  const { movieDetails } = route.params;
  
  //Stars for rating
  const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const starImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

  //Rating PopUp consts
  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1,2,3,4,5]);

  const rateMovie = () => {
  db.transaction(tx => {
    tx.executeSql(`Select * FROM ratings WHERE title="${movieDetails.original_title}";`,
    [],
    (tx, results) => {
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
    <View >
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
    backgroundColor: '#191919',
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
    color: 'white',
  },

  releaseDateText: {
    fontSize: 15,
    color: 'white',
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