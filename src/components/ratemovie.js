import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function RateMovie({ navigation, route }) {
    const { movieForRating } = route.params;
    const [movie, setMovie] = useState('');
    const [movieWithRating, setMovieWithRating] = useState([]);
    const [ratingsItem, setRatingsItem] = useState(movieForRating);
    const [ratingsList, setRatingsList] = useState([]);

    //Stars for rating
    const starImgFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
    const starImgCorner = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';

    // Popup modalVisible
    const [modalVisible, setModalVisible] = useState(false);

    //Rating PopUp consts
    const [defaultRating, setDefaultRating] = useState(2);
    const [maxRating, setMaxRating] = useState([1,2,3,4,5]);

    const rateMovie = (item) => {
    console.log(defaultRating);
    console.log(movieForRating);

    useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists ratings (id integer primary key not null, title text, poster text, release_date text, rating);');
    }, null, null);
    }, []);

    /*db.transaction(tx => {
      tx.executeSql('insert into ratings (title, poster, release_date, rating) values (?, ?, ?, ?);',
        [item.original_title, item.poster_path, item.release_date, movieWithRating.rating]);
    }, errorAlertSave, updateRatingsList);*/
    
    }

    const updateRatingsList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from ratings;', [], (_, { rows }) =>
        setRatingsList(rows._array)
      );
    }, null, null);
    }

    const CustomRatingBar = () => {
    return (
        <View style={styles.customRatingBarStyle}>
                return (
                <TouchableOpacity
                activeOpacity={0.7}
                key={ratingsItem}
                onPress={() => setDefaultRating(ratingsItem)}
                >
                    <Image 
                    style={styles.starImgStyle}
                    source={ratingsItem <= defaultRating ? {uri: starImgFilled} : {uri: starImgCorner}}
                    />

                </TouchableOpacity>
                )
        </View>
        )
    }

    const RatingPopup = () => {
    return (
      <View style={styles.ratingContainer}>
        {/* Add a rating */}
          <Image source={{uri: "https://image.tmdb.org/t/p/w500" + movieForRating.poster_path}} />
          <CustomRatingBar />
          <Button onPress={rateMovie} title="Save Rating" />
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