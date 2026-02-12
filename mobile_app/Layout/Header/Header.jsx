import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Pressable, Keyboard, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../_helper/AuthContext';
import ListOfMenu from '../ListOfMenu';
import axios from 'axios';
import { getMovies } from '../../Endpoint';
import { Ionicons } from '@expo/vector-icons';
import { MENUITEMS } from '../../Menu';

const Header = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [movies, setMovies] = useState([]);
  const navigation = useNavigation();
  const [showGenres, setShowGenres] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(getMovies, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
        <Text style={styles.brand}>Movie House</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search here"
          value={searchValue}
          onChangeText={handleSearch}
        />
        {isFocused && (
          <>
            <Pressable
              onPress={() => {
                setIsFocused(false);
                Keyboard.dismiss();
              }}
              style={styles.overlay}
            />
              <View style={styles.dropdownWrapper}>
                <ListOfMenu
                  searchResult={searchResult}
                  setSearchValue={setSearchValue}
                  setIsFocused={setIsFocused}
                  style={styles.searchDropdown}
                />
              </View>
          </>
        )}
      </View>
      <Pressable
        style={styles.genreButton}
        onPress={() => setShowGenres(!showGenres)}
      >
        <Ionicons name="grid-outline" size={24} color="#333" />
      </Pressable>

      {showGenres && (
        <View style={styles.genreDropdown}>
          {MENUITEMS.map(item => (
            item.Items.map((menuItem, idx) => {
              return(
                <View style={styles.genreDropdownContainer}>
              {menuItem.type === 'sub' && menuItem.children &&
                menuItem.children.map((genre, cIdx) => {
                  console.log(genre);
                  return(
                    <Pressable
                      key={cIdx}
                      style={styles.genreItem}
                      onPress={() => {
                        setShowGenres(false);
                        navigation.navigate("FilteredMovies", { genre: genre.path });
                      }}
                    >
                      {genre.icon({ size: 20, color: "#333", style: { marginRight: 8 } })}
                      <Text style={styles.genreText}>{genre.title}</Text>
                    </Pressable>
                  )
                })
              }
              </View>
              )
            })
          ))}
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerWrapper: {
    zIndex: 50,
  },
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
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  dropdownWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  searchDropdown: {
    backgroundColor: '#fff',
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  genreButton: {
    padding: 6,
    marginLeft: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
  },
  genreDropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 180,
    maxHeight: 200,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    zIndex: 50,
  },
  genreDropdownContainer: {
    maxHeight: 200,
    overflowX: 'scroll'
  },
  genreItem: {
    padding: 1,
    display: 'flex',
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  genreText: {
    fontSize: 16,
    color: "#000",
  },
});
