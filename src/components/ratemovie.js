import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function RateMovie({ navigation, route }) {
    const { MovieDetails } = route.params;
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

    return (
        <View>
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