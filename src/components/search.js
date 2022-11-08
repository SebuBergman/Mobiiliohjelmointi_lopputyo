import React from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ListItem, Button, Avatar, Input } from 'react-native-elements';

export default function SearchScreen() {
  const [keyword, setKeyword] = useState('Star Wars');
  const [searchResults, setSearchResults] = useState([]);
  const [movie, setMovie] = useState('');

  useEffect(() => {
      getMovie();
    }, []);
  
  const getMovie = () => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=7781089812bce5be2d5c7957b17b321a&language=en-US&query=${keyword}&page=1&include_adult=false`)
    .then(res => res.json())
    .then(data => {
      setSearchResults(data.results);
      console.log(searchResults);
    })
    .catch(err => console.error(err));
  }

  const saveMovie = (item) => {
    setMovie(item.original_title);
    console.log("movie saved?")
    console.log(movie);
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
                <Avatar source={{uri: "https://image.tmdb.org/t/p/w500" + item.poster_path}} />
                <ListItem.Content>
                  <ListItem.Title>{item.original_title}</ListItem.Title>
                  <ListItem.Subtitle>{item.release_date}</ListItem.Subtitle>
                  <Button title="Save" type="outline" onPress={saveMovie(item)}></Button>
                </ListItem.Content>
              </ListItem>
            ))
          }
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 10,
    alignItems: "center",
    height: 120,
  },
  searchResultsContainer: {
    marginTop: 10,
    height: 200,
  }
});