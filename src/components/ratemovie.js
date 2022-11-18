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
        rateTheMovie();
      } else {
        Alert.alert('Movie already rated');
        navigation.goBack();
      }
    });
  });
  /*
  db.transaction(tx => {
    tx.executeSql(`SELECT EXISTS(Select 1 FROM ratings WHERE title="${movieDetails.original_title}");`);
  }, rateTheMovie, AlertFound);*/
  }

  const rateTheMovie = () => {
    db.transaction(tx => {
    tx.executeSql('insert into ratings (title, poster, release_date, rating) values (?, ?, ?, ?);',
      [movieDetails.original_title, movieDetails.poster_path, movieDetails.release_date, defaultRating]);
  }, errorAlertSave, AlertSave);

  navigation.goBack();
  }

  const errorAlertSave = () => {
  Alert.alert('Something went wrong saving');
  }

  const AlertSave = () => {
  Alert.alert('Rating saved');
  }

  useEffect(() => {
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
    <View style={styles.ratingContainer}>
      {/* Add a rating */}
        <Avatar size={"large"} source={{uri: "https://image.tmdb.org/t/p/w500" + movieDetails.poster_path}} />
        <Text>{movieDetails.original_title}</Text>
        <Text>{movieDetails.release_date}</Text>
        <View>
          <CustomRatingBar />
          <Button onPress={rateMovie} title="Save Rating" />
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
});