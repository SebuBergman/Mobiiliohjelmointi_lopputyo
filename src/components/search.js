import React from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeBaseProvider, Box, Center, Button, Input, FlatList, HStack, Avatar, VStack, Spacer, Heading } from "native-base";

export default function SearchScreen() {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [movie, setMovie] = useState('');

  const getMovie = () => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=7781089812bce5be2d5c7957b17b321a&language=en-US&query=${keyword}&page=1&include_adult=false`)
    .then(res => res.json())
    .then(data => {
      setSearchResults(data);
      console.log(searchResults);
    })
    .catch(err => console.error(err));
    }

  useEffect(() => {
    getMovie();
    
  }, []);

  return (
    <NativeBaseProvider>
        <Center>
          <Box  maxW="80" style={styles.searchContainer}>
            <Input mx="2" placeholder="Input" w="100%" onChangeText={text => setKeyword(text) } />
            <Button onPress={getMovie} >Search</Button>
          </Box>
        </Center>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 10,
    alignItems: "center",
  }
});