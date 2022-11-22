import React from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image, ScrollView, TextInput } from 'react-native';
import { ListItem, Button, Avatar, Input, Rating, Icon } from 'react-native-elements';
import { useFocusEffect } from "@react-navigation/core";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('moviedb.db');

export default function ProfileScreen({ navigation, route }) {
  const [profileName, setProfileName] = useState('Set profile name');
  const [profileNameTemp, setProfileNameTemp] = useState('');
  const [profileList, setProfileList] = useState([]);

  // Popup modalVisible
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction(tx => {
        tx.executeSql('select * from profile;', [], (_, { rows }) =>
          setProfileList(rows._array)
        );
      }, null, null);
    
    db.transaction(tx => {
      tx.executeSql(`Select * FROM profile WHERE id="1";`,
      [],
      (tx, results) => {
        console.log("results profiledone?:");
        console.log(results.rows._array[0].profilename);
        if (results.rows.length == 0) {
          setModalVisible(true);
        } else {
          setProfileName(results.rows._array[0].profilename);
        }
      });
      });
    }, []));

  const updateProfile = () => {
    db.transaction(tx => {
      tx.executeSql('select * from profile;', [], (_, { rows }) =>
        setProfileList(rows._array)
      );
    }, null, null);
  }

  const addProfileName = () => {
    db.transaction(tx => {
    tx.executeSql(`Select profilename FROM profile WHERE id="1";`,
    [],
    (tx, results) => {
      console.log("Rows addProfile:");
      console.log(results.rows);
      if (results.rows.length == 0) {
        db.transaction(tx => {
          tx.executeSql('insert into profile (profilename, watchlisted, ratings) values (?, ?, ?);',
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
      <View style={styles.profileHeader}>
        <Icon
          name='person-circle-outline'
          type='ionicon'
          color='#517fa4'
        />
        <Text style={styles.heading}>{profileName}</Text>
      </View>
      <View style={styles.settingsIconHeader}>
        <Icon
          name='settings-outline'
          type='ionicon'
          color='#517fa4'
          onPress={() => setModalVisible(true)}
        />
      </View>
      <View style={styles.container}>
        <Button onPress={() => navigation.push('Watchlist')} title="Watchlist" />
        <Button onPress={() => navigation.push('Ratings')} title="Ratings" />

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
  heading: {
    fontSize: 25,
    color: "black",
  },

  //PartyMode Options Addplayers Popup (PartyModeOptions)
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 40,
    },

    addName: {
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

    profileHeader: {
      position: 'absolute',
      left: 10,
      top: 50,
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsIconHeader: {
      position: 'absolute',
      right: 20,
      top: 50,
    },
});