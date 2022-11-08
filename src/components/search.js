import React from "react";
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeBaseProvider, Box, Center, Button, Input, FlatList, HStack, Avatar, VStack, Spacer, Heading, Text } from "native-base";

export default function SearchScreen() {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([{
    "page": 1,
    "results": [
        {
            "adult": false,
            "backdrop_path": "/iYLKMV7PIBtFmtygRrhSiyzcVsF.jpg",
            "genre_ids": [
                12,
                35,
                10751,
                16
            ],
            "id": 277834,
            "original_language": "en",
            "original_title": "Moana",
            "overview": "In Ancient Polynesia, when a terrible curse incurred by Maui reaches an impetuous Chieftain's daughter's island, she answers the Ocean's call to seek out the demigod to set things right.",
            "popularity": 38.624,
            "poster_path": "/4JeejGugONWpJkbnvL12hVoYEDa.jpg",
            "release_date": "2016-10-13",
            "title": "Moana",
            "video": false,
            "vote_average": 7.6,
            "vote_count": 10777
        },
        {
            "adult": false,
            "backdrop_path": null,
            "genre_ids": [],
            "id": 990706,
            "original_language": "mi",
            "original_title": "Moana Reo Māori",
            "overview": "Moana dubbed in te reo Maaori",
            "popularity": 52.358,
            "poster_path": "/7b0k9u649GLBxhu2mqrSc9MT4aJ.jpg",
            "release_date": "2017-09-11",
            "title": "Moana Reo Māori",
            "video": false,
            "vote_average": 6.7,
            "vote_count": 3
        },    ],
    "total_pages": 1,
    "total_results": 10
}]);
  const [movie, setMovie] = useState('');

  const getMovie = () => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=7781089812bce5be2d5c7957b17b321a&language=en-US&query=${keyword}&page=1&include_adult=false`)
    .then(res => res.json())
    .then(data => {
      //setSearchResults(data);
      //console.log(searchResults);
    })
    .catch(err => console.error(err));
    }

  useEffect(() => {
    getMovie();
    
  }, []);

  return (
    <NativeBaseProvider>
        <Center>
          <Box maxW="80" style={styles.searchContainer}>
            <Input mx="2" placeholder="Input" w="100%" onChangeText={text => setKeyword(text) } />
            <Button onPress={getMovie} >Search</Button>
          </Box>
          <Box maxW="80" style={styles.searchResultsContainer}>
            <Heading fontSize="xl" p="4" pb="3">
              Search results:
            </Heading>
            <FlatList data={searchResults} renderItem={({ item }) =>
            <Box borderBottomWidth="1" _dark={{
              borderColor: "muted.50"
            }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                <HStack space={[2, 3]} justifyContent="space-between">
                  <Avatar size="48px" source={{
                    uri: item.results.poster_path
                  }} />
                  <VStack>
                    <Text _dark={{
                      color: "warmGray.50"
                    }} color="coolGray.800" bold>
                      {item.results.original_title}
                    </Text>
                    <Text color="coolGray.600" _dark={{
                      color: "warmGray.200"
                    }}>
                      {item.results.release_date}
                    </Text>
                  </VStack>
                </HStack>
            </Box>} keyExtractor={item => item.id} />
          </Box>
        </Center>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 10,
    alignItems: "center",
    height: 80,
  },
  searchResultsContainer: {
    marginTop: 10,
    alignItems: "center",
    height: 300,
  }
});