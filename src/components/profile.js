import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image, ScrollView, TextInput, StatusBar } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating, Icon } from 'react-native-elements';
import { useFocusEffect } from "@react-navigation/core";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function ProfileScreen({ navigation, route }) {
  const [profileName, setProfileName] = useState('Set profile name');
  const [profileNameTemp, setProfileNameTemp] = useState('');
  const [profileList, setProfileList] = useState([]);
  const [ratingsAmount, setRatingsAmount] = useState([]);
  const [watchlistAmount, setWatchlistAmount] = useState([]);
  const [watchlistedMovies, setWatchlistedMovies] = useState([]);
  const [ratingPictures, setRatingsPictures] = useState([]);

  // Popup modalVisible
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM profile;', [], (_, { rows }) =>
          setProfileList(rows._array)
        );
      }, null, null);
    
      db.transaction(tx => {
        tx.executeSql(`SELECT * FROM profile WHERE id="1";`,
        [],
        (tx, results) => {
          if (results.rows.length == 0) {
            setModalVisible(true);
          } else {
            setProfileName(results.rows._array[0].profilename);
          }
        });
      });

      db.transaction(tx => {
        tx.executeSql(`SELECT * FROM ratings;`,
        [],
        (tx, results) => {
          setRatingsAmount(results.rows.length);
        });
      });

      db.transaction(tx => {
        tx.executeSql(`SELECT poster FROM ratings;`,
        [],
        (tx, results) => {
          console.log(results.rows);
        });
      });

      db.transaction(tx => {
        tx.executeSql('SELECT poster FROM ratings LIMIT 3;', [], (_, { rows }) =>
          setRatingsPictures(rows._array)
        );
      }, null, null);

      db.transaction(tx => {
        tx.executeSql(`SELECT * FROM watchlist;`,
        [],
        (tx, results) => {
          setWatchlistAmount(results.rows.length);
        });
      });

      db.transaction(tx => {
        tx.executeSql('SELECT * FROM watchlist;', [], (_, { rows }) =>
          setWatchlistedMovies(rows._array)
        );
      }, null, null);
    }, [])
  );

  const updateProfile = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM profile;', [], (_, { rows }) =>
        setProfileList(rows._array)
      );
    }, null, null);
  }

  const updateWatchlist = () => {
    db.transaction(tx => {
      tx.executeSql('select * from watchlist;', [], (_, { rows }) =>
        setWatchlistedMovies(rows._array)
      );
    }, null, null);
  }

  const deleteWatchlistItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from watchlist where id = ?;', [id]);
    }, errorAlertDelete, updateWatchlist);
  }

  const errorAlertDelete = () => {
    Alert.alert('Something went wrong with deletion');
  }

  const addProfileName = () => {
    db.transaction(tx => {
    tx.executeSql(`SELECT profilename FROM profile WHERE id="1";`,
    [],
    (tx, results) => {
      if (results.rows.length == 0) {
        db.transaction(tx => {
          tx.executeSql('INSERT INTO profile (profilename, watchlisted, ratings) values (?, ?, ?);',
            [profileName, 0, 0]);
        }, null, null);
      } else {
        db.transaction(tx => {
          tx.executeSql('UPDATE profile SET profilename=? WHERE id=1;',
            [profileName]);
        }, null, null);
      }
    });
    }, null, updateProfile);
    setModalVisible(!modalVisible);
  }

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#191919"
        barStyle = "light-content"
      />
      <View style={styles.profileHeader}>
        <Icon
          name='person-circle-outline'
          type='ionicon'
          color='#517fa4'
        />
        <Text style={styles.profileText}>{profileName}</Text>
      </View>
      <View style={styles.settingsIconHeader}>
        <Icon
          name='settings-outline'
          type='ionicon'
          color='#517fa4'
          onPress={() => setModalVisible(true)}
        />
      </View>
      <View style={styles.ratingsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Ratings')}>
          <View style={styles.ratingMoviesContainer}>
          {
            ratingPictures.map((item, i) => (
            <ListItem key={i} containerStyle={styles.ratingMovies}>
              <Image source={{uri: "https://image.tmdb.org/t/p/w500" + item.poster}} style={styles.moviePosterArtRatings} />
            </ListItem>
            ))
          }
          </View>
          <View style={styles.rowCenterTextRatings}>
            <Text style={styles.headingText}>Ratings</Text>
            <Text style={styles.normalText}> {ratingsAmount} </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.watchlistContainer}>
        <View style={styles.rowCenterText}>
          <Text style={styles.headingText}>Your Watchlist</Text>
          <Text style={styles.normalText}> {watchlistAmount} </Text>
          <Button title="See all" type="outline" onPress={() => navigation.navigate('Watchlist')} buttonStyle={{width:75}}></Button>
        </View>
        <ScrollView style={styles.watchlistedItems} horizontal={true}>
          {
            watchlistedMovies.map((item, i) => (
              <ListItem key={i} containerStyle={styles.watchlistedMovies}>
                <View style={styles.watchlistColumn}>
                  <Image source={{uri: "https://image.tmdb.org/t/p/w500" + item.poster}} style={styles.moviePosterArt} />
                    <ListItem.Content>
                      <View style={{paddingLeft: 5}}>
                      <ListItem.Title style={{ color: 'white', height: 40}} numberOfLines={2}>{item.title}</ListItem.Title>
                      <ListItem.Subtitle style={{ color: 'white' }}>{item.release_date}</ListItem.Subtitle>
                      </View>
                      <View style={styles.buttonContainer}>
                        <Button title="Watched" type="outline" onPress={() => deleteWatchlistItem(item.id)}></Button>
                      </View>
                      
                    </ListItem.Content>
                </View>
            </ListItem>
            ))
          }
        </ScrollView>
      </View>
      {/* Popup for name change */}
        <View style={styles.modalView}>
          <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}>
              <Pressable style={styles.outsideModal}
                onPress={(event) => { if (event.target == event.currentTarget) { 
                  setModalVisible(false); }
                }} >
                  {/* Add a profilename */}
                  <View style={styles.modal}>
                      <View style={styles.modalHeader}>
                          <View style={styles.modalHeaderContent}>
                              <Text>Set Profile name</Text>
                          </View>
                          <TouchableOpacity onPress={() => setModalVisible(false)}>
                              <Text style={styles.modalHeaderCloseText}>X</Text>
                          </TouchableOpacity>
                      </View>
                      <View style={styles.modalContent}>
                          <TextInput
                              placeholderTextColor={'grey'}
                              style={styles.addName}
                              placeholder='Insert profile name'
                              onChangeText={profileName => setProfileName(profileName)}
                              value={profileName} />
                          <Button title="Save name" type="outline" onPress={addProfileName} ></Button>
                      </View>
                  </View>
              </Pressable>
          </Modal>
        </View>
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

  //Text Styles
  headingText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    paddingLeft: 10,
  },

  normalText: {
    color: 'white',
    fontSize: 20,
  },

  numberText: {
    color: 'white',
    fontSize: 15,
  },

  profileText: {
    color: "white",
    fontSize: 20,
    paddingLeft: 10,
  },

  //Profile name and settings button
  profileHeader: {
    position: 'absolute',
    left: 10,
    top: 10,
    flexDirection: "row",
    justifyContent: 'center',
  },

  settingsIconHeader: {
    position: 'absolute',
    right: 20,
    top: 10,
  },

  //Ratings Styles
  ratingsContainer: {
    backgroundColor: "#212121",
    width: 287,
    marginBottom: 10,

    //Shadow for View
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  ratingMoviesContainer: {
    flexDirection: 'row',
    padding: 10,
  },

  ratingMovies: {
    backgroundColor: 'rgba(52, 52, 52)',
    padding: 0,
  },

  rowCenterTextRatings: {
    flexDirection: "row",
    alignItems: 'center',
    paddingTop: 0,
    padding: 10,
  },

  moviePosterArtRatings: {
    width: 89,
    height: 125,
  },
  
  //Watchlist Styles
  watchlistContainer: {
    backgroundColor: "#212121",
    height: 360,
    borderColor: "black",
    paddingBottom: 10,
    paddingTop: 10,

    //Shadow for View
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  watchlistedItems: {
    marginLeft: 5,
    width: 355,
  },

  rowCenterText: {
    flexDirection: "row",
    alignItems: 'center',
  },

  watchlistedMovies: {
    backgroundColor: "#2a2a2a",
    height: 300,
    width: 120,
    padding: 0,
    margin: 5,
    
    //Shadow for View
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  watchlistColumn: {
    flexDirection: "column",
    justifyContent: "center",
  },

  moviePosterArt: {
    width: 120,
    height: 175,
  },

  buttonContainer: {
    padding: 6,
    paddingBottom: 5,
    width: "100%",
  },

  //Name setting popup styles
  modalView: {
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    height: 200,
    margin: 50,
    padding: 0,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    textAlign: "centered",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10
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

  //Modal AddName
  addName: {
    fontSize: 18,
    borderBottomWidth: 1.0,
    borderColor: "#0055b3",
    marginBottom: 5,
    color: 'black',
  },
});