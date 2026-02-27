import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import Loader from '../Layout/Loader';
import MovieCard from './CommonElements/MovieCard';
import MovieForm from './Forms/MovieForm';
import axios from 'axios';
import AuthContext from '../_helper/AuthContext';
import { getAllFavorites } from '../Endpoint';
import LoadingContext from '../_helper/LoadingContext';
import { Dimensions } from "react-native";

const Favorites = ({ navigation }) => {
  const {loading, setLoading} = useContext(LoadingContext)

  const [movies, setMovies] = useState([]);

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const CARD_WIDTH = (SCREEN_WIDTH - 30) / 2; 
  const [numColumns, setNumColumns] = useState(getNumColumns());

  function getNumColumns() {
    const width = Dimensions.get("window").width;

    if (width >= 1200) return 6;   // large tablets / desktop
    if (width >= 900) return 5;
    if (width >= 600) return 4;    // tablets
    if (width >= 535) return 3;
    return 2;                      // small phones
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setNumColumns(getNumColumns());
    });

    return () => subscription?.remove();
  }, []);
  
  const fetchData = async () => {
    try {

      const response = await axios.get(getAllFavorites + JSON.parse(localStorage.getItem('userId')), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      withCredentials: true
   })

      console.log(response.data);
      setMovies(response.data);

      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
  };


  useEffect(() => {
    fetchData();
    setLoading(false);
  }, []);

  const handleMoviePress = (movie) => {
    console.log(movie);
    navigation.navigate('MovieWatcher', { id: movie.id });
  };

  return loading ? <Loader /> : (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <Text style={styles.title}>Favorite Movies</Text>
      </View>
      
      <View style={{height: '80vh'}}>
        <FlatList
          key={numColumns}
          data={movies}
          keyExtractor={(item, idx) => idx.toString()}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <MovieCard props={item} onPress={() => handleMoviePress(item)}  style={{width: CARD_WIDTH}}/>
          )}
          onEndReachedThreshold={0.5}
          scrollEventThrottle={17}
        />
      </View>
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  flexRow: {
    justifyContent: 'start',
    display: 'flex',
    flexDirection: 'row',
    // margin: '10px',
    marginBottom: '20px'
  }
});
