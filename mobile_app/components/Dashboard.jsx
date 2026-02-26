import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Modal, ActivityIndicator, TextInput } from 'react-native';
import Loader from '../Layout/Loader';
import MovieCard from './CommonElements/MovieCard';
import MovieForm from './Forms/MovieForm';
import axios from 'axios';
import AuthContext from '../_helper/AuthContext';
import { getLimitedMovies, getMovies } from '../Endpoint';
import LoadingContext from '../_helper/LoadingContext';
import { Dimensions } from "react-native";

const Dashboard = ({ navigation }) => {
  const {loading, setLoading} = useContext(LoadingContext)
  const [createMovie, setCreateMovie] = useState(false);

  const { role } = useContext(AuthContext);

  // Infinite scroll pagination
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const MOVIES_PER_PAGE = 8;

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


  const fetchData = async (loadMore = false) => {
    try {
      if (loadMore) setLoadingMore(true);
      else setLoading(true);

      const token = localStorage.getItem("token");
      const response = await axios.get(getLimitedMovies, {
        params: { page, limit: MOVIES_PER_PAGE },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);
      if (loadMore) {
        setMovies(prev => [...prev, ...response.data]);
      } else {
        setMovies(response.data);
      }
      if (response.data.length < MOVIES_PER_PAGE) setHasMore(false);

      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
  };


  useEffect(() => {
    fetchData(page === 1 ? false : true);
    setLoading(false);
  }, [page]);

  // Load more when reaching bottom
  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    setPage(prev => prev + 1);
  };


  const handleMoviePress = (movie) => {
    console.log(movie);
    navigation.navigate('MovieWatcher', { id: movie.id });
  };

  return loading ? <Loader /> : (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <Text style={styles.title}>Dashboard</Text>

        {role === 'Superadmin' && (
          <View style={styles.addButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setCreateMovie(true)}>
              <Text style={styles.text}>Add Movie</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={{flex: 1}}>
        <FlatList
          key={numColumns}
          data={movies}
          keyExtractor={(item, idx) => idx.toString()}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <MovieCard props={item} onPress={() => handleMoviePress(item)} style={{width: CARD_WIDTH}}/>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          scrollEventThrottle={17}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="large" /> : null
          }
        />
      </View>

      {/* Modal for creating movie */}
      <Modal visible={createMovie} animationType="slide">
        <MovieForm setCreateMovie={setCreateMovie} setMovies={setMovies} />
      </Modal>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButtonContainer: {
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#24695c",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontWeight: "390"
  }
});
