import { useEffect, useState } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { getFilteredMovies } from "../Endpoint";
import { StyleSheet } from "react-native";
import Loader from "../Layout/Loader";
import { View, FlatList, Text } from "react-native-web";
import MovieCard from "./CommonElements/MovieCard";
import { Dimensions } from "react-native";

const FilteredMovies = () => {
  const route = useRoute();
  const raw = route.params.genre;
  const genre = raw?.split("genre=")[1];

  const [isLoading, setIsLoading] = useState(true);
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
  
  async function fetchMovies() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${getFilteredMovies}genre=${genre}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setMovies(response.data);
    } catch (err) {
      console.log(err);
      window.alert("Error. Something went wrong");
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }

  const genreType = String(genre).charAt(0).toUpperCase() + String(genre).slice(1, );

  useEffect(() => {
    fetchMovies();
  }, [genre]);

  return isLoading ? <Loader /> : (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <Text style={styles.title}>Filtered {genreType} Movies</Text>
      </View>
      
      <View style={{height: '72vh'}}>
        <FlatList
          key={numColumns}
          data={movies}
          keyExtractor={(item, idx) => idx.toString()}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <MovieCard props={item} onPress={() => handleMoviePress(item)} style={{width: CARD_WIDTH}}/>
          )}
          onEndReachedThreshold={0.5}
          scrollEventThrottle={17}
        />
      </View>
    </View>
  );
};

export default FilteredMovies;

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
    margin: '10px',
    marginBottom: '20px'
  }
});
