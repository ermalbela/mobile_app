import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../_helper/AuthContext';
// import ListOfMenu from '../ListOfMenu';
import axios from 'axios';
import { getMovies } from '../../Endpoint';

const Header = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [movies, setMovies] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(getMovies, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}` },
        withCredentials: true,
      });
      setMovies(response.data);
    } catch (err) {
      console.log(err);
    }
  };


  const handleSearch = (keyword) => {
    setSearchValue(keyword);
    if (keyword) {
      setIsFocused(true);
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(keyword.toLowerCase())
      );
      setSearchResult(filtered);
    } else {
      setIsFocused(false);
      setSearchResult([]);
    }
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.leftHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.brand}>Movie House</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search here"
          value={searchValue}
          onChangeText={handleSearch}
        />
        {isFocused && searchResult.length > 0 && (
          <FlatList
            data={searchResult}
            keyExtractor={(item) => item.id.toString()}
            // renderItem={({ item }) => (
            //   // <ListOfMenu
            //   //   movie={item}
            //   //   setSearchValue={setSearchValue}
            //   //   setIsFocused={setIsFocused}
            //   // />
            // )}
            style={styles.searchDropdown}
          />
        )}
      </View>

      {/* <View style={styles.rightMenu}>
        <Rightbar />
      </View> */}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 4,
    zIndex: 10,
  },
  leftHeader: { flexDirection: 'row', alignItems: 'center' },
  brand: { fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  searchContainer: { flex: 1, marginHorizontal: 10 },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  searchDropdown: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    maxHeight: 200,
    zIndex: 20,
  },
//   rightMenu: { flexDirection: 'row', alignItems: 'center' },
});
